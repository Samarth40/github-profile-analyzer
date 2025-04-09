import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, Bar, BarChart } from 'recharts'
import { Search, Github, Star, GitFork, Calendar, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Separator } from "./ui/separator"
import { WelcomeGuide } from "./WelcomeGuide"

interface Repo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  language: string | null;
  updated_at: string;
}

interface CommitData {
  date: string
  count: number
  additions?: number
  deletions?: number
  repositories?: { [key: string]: number }
}

const UserProfile = () => {
  const [username, setUsername] = useState('')
  const [searchUsername, setSearchUsername] = useState('')
  const [timeRange, setTimeRange] = useState('30') // days
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState(localStorage.getItem('github_token') || '')
  const [tokenSaved, setTokenSaved] = useState(false)

  // Create axios instance with auth header
  const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })

  const { data: repos, isLoading: reposLoading, error: reposError } = useQuery({
    queryKey: ['repos', searchUsername, token],
    queryFn: async () => {
      try {
        if (!searchUsername) return []
        const response = await githubApi.get(`/users/${searchUsername}/repos`, {
          params: {
            sort: 'updated',
            per_page: 100,
            type: 'owner'
          }
        })
        setError(null)
        return response.data as Repo[]
      } catch (error: any) {
        if (error.response?.status === 403) {
          setError('Rate limit exceeded. Please add a GitHub token to continue.')
        } else if (error.response?.status === 404) {
          setError('User not found. Please check the username and try again.')
        } else {
          setError(error.message || 'An error occurred while fetching repositories.')
        }
        throw error
      }
    },
    enabled: !!searchUsername,
    retry: false
  })

  const { data: commits, isLoading: commitsLoading, error: commitsError } = useQuery({
    queryKey: ['commits', searchUsername, timeRange, token],
    queryFn: async () => {
      try {
        if (!searchUsername) return []
        
        const reposResponse = await githubApi.get(`/users/${searchUsername}/repos`)
        const repos = reposResponse.data

        // Calculate date range
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - parseInt(timeRange))

        // Initialize daily commit data
        const commitData: { [key: string]: CommitData } = {}
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0]
          commitData[dateStr] = {
            date: dateStr,
            count: 0,
            additions: 0,
            deletions: 0,
            repositories: {}
          }
        }

        // Fetch commits for each repository
        const commitPromises = repos.map(async (repo: Repo) => {
          try {
            const commitsResponse = await githubApi.get(
              `/repos/${searchUsername}/${repo.name}/commits`,
              {
                params: {
                  since: startDate.toISOString(),
                  until: endDate.toISOString(),
                  per_page: 100,
                  author: searchUsername
                }
              }
            )

            for (const commit of commitsResponse.data) {
              const date = commit.commit.author.date.split('T')[0]
              if (commitData[date]) {
                commitData[date].count++
                if (!commitData[date].repositories) {
                  commitData[date].repositories = {}
                }
                commitData[date].repositories[repo.name] = (commitData[date].repositories[repo.name] || 0) + 1

                try {
                  const detailResponse = await githubApi.get(commit.url)
                  const detail = detailResponse.data
                  if (detail.stats) {
                    commitData[date].additions = (commitData[date].additions || 0) + detail.stats.additions
                    commitData[date].deletions = (commitData[date].deletions || 0) + detail.stats.deletions
                  }
                } catch (error) {
                  console.error('Error fetching commit details:', error)
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching commits for ${repo.name}:`, error)
          }
        })

        await Promise.all(commitPromises)
        setError(null)
        return Object.values(commitData).sort((a, b) => a.date.localeCompare(b.date))
      } catch (error: any) {
        if (error.response?.status === 403) {
          setError('Rate limit exceeded. Please add a GitHub token to continue.')
        } else {
          setError(error.message || 'An error occurred while fetching commit data.')
        }
        throw error
      }
    },
    enabled: !!searchUsername,
    retry: false
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (username.trim()) {
      setSearchUsername(username.trim());
    }
  };

  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('github_token', token);
    setTokenSaved(true);
    // Reset the saved state after 2 seconds
    setTimeout(() => setTokenSaved(false), 2000);
    // Refetch data with new token
    if (searchUsername) {
      setSearchUsername(searchUsername);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            GitHub Profile Analyzer
          </h1>
          <p className="text-muted-foreground text-center max-w-md">
            Enter a GitHub username to analyze their repositories and commit activity
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <form onSubmit={handleTokenSubmit} className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Input
                type="password"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setTokenSaved(false);
                }}
                placeholder="Enter GitHub Personal Access Token (optional)"
                className="pl-10"
              />
            </div>
            <Button 
              type="submit" 
              variant={tokenSaved ? "default" : "outline"}
              className={tokenSaved ? "bg-green-600 hover:bg-green-700" : ""}
              disabled={tokenSaved}
            >
              {tokenSaved ? "Saved!" : "Save Token"}
            </Button>
          </form>

          <form onSubmit={handleSubmit} className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className="pl-10"
              />
            </div>
            <Button type="submit" className="gap-2">
              <Github className="h-5 w-5" />
              Analyze
            </Button>
          </form>
        </div>

        {!searchUsername && <WelcomeGuide />}

        {reposLoading || commitsLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
            {repos && repos.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Github className="h-6 w-6" />
                  Repositories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {repos.map((repo) => (
                    <Card 
                      key={repo.id} 
                      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary transition-colors duration-200 truncate group-hover:text-primary"
                          >
                            {repo.name}
                          </a>
                          {repo.language && (
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                              {repo.language}
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[2.5rem] group-hover:text-foreground/90 transition-colors duration-200">
                          {repo.description || "No description provided"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-200">
                            <Star className="h-4 w-4" />
                            {repo.stargazers_count}
                          </div>
                          <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-200">
                            <GitFork className="h-4 w-4" />
                            {repo.forks_count}
                          </div>
                          <div className="flex items-center gap-1 ml-auto text-xs group-hover:text-foreground/75 transition-colors duration-200">
                            Updated: {new Date(repo.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {commits && commits.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    Commit Activity
                  </h2>
                  <div className="flex gap-2">
                    {['7', '30', '90'].map((days) => (
                      <Button
                        key={days}
                        variant={timeRange === days ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeRange(days)}
                      >
                        {days} days
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Commits</CardTitle>
                      <CardDescription>Number of commits per day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={commits}>
                            <defs>
                              <linearGradient id="colorCommit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#a0aec0"
                              tick={{ fill: '#a0aec0' }}
                            />
                            <YAxis 
                              stroke="#a0aec0"
                              tick={{ fill: '#a0aec0' }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1a202c',
                                border: '1px solid #2d3748',
                                borderRadius: '0.5rem',
                                color: '#e2e8f0'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="count" 
                              stroke="#8884d8" 
                              fillOpacity={1} 
                              fill="url(#colorCommit)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Code Changes</CardTitle>
                      <CardDescription>Lines added and removed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={commits}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#a0aec0"
                              tick={{ fill: '#a0aec0' }}
                            />
                            <YAxis 
                              stroke="#a0aec0"
                              tick={{ fill: '#a0aec0' }}
                            />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: '#1a202c',
                                border: '1px solid #2d3748',
                                borderRadius: '0.5rem',
                                color: '#e2e8f0'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="additions" fill="#4ade80" name="Additions" />
                            <Bar dataKey="deletions" fill="#f87171" name="Deletions" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="mt-16">
        <Separator className="my-8" />
        <div className="container flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built by</span>
            <a
              href="https://samarthshinde.tech"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              samarthshinde.tech
            </a>
            <span>•</span>
            <span>Internship Assignment</span>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground hover:text-foreground -mr-2 h-8 w-8"
            >
              <a
                href="https://samarthshinde.tech"
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Portfolio</span>
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserProfile 