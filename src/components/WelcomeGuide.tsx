import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Search, Star, GitFork, Calendar, Sparkles, Code2, GitBranch, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

export function WelcomeGuide() {
  return (
    <div className="mt-8 px-4">
      <Tabs defaultValue="how-to-use" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="how-to-use" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-500">
            <Search className="h-4 w-4 mr-2" />
            How to Use
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500">
            <Sparkles className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-500">
            <Github className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="how-to-use">
          <div className="grid gap-6">
            <Button variant="ghost" className="w-full justify-start gap-4 pl-8 group relative h-auto p-6">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                1
              </span>
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium">Enter GitHub Username</span>
                <span className="text-sm text-muted-foreground">Type a GitHub username in the search box above</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-purple-500 ml-auto transition-colors" />
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-4 pl-8 group relative h-auto p-6">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                2
              </span>
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium">Click Analyze</span>
                <span className="text-sm text-muted-foreground">View detailed profile information and statistics</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-blue-500 ml-auto transition-colors" />
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-4 pl-8 group relative h-auto p-6">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full" />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20 transition-colors">
                3
              </span>
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium">Add GitHub Token</span>
                <span className="text-sm text-muted-foreground">Optional: Add token for increased API limits</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-cyan-500 ml-auto transition-colors" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid gap-6">
            <Button variant="ghost" className="w-full justify-start gap-4 group relative h-auto p-6 hover:bg-blue-500/5">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Code2 className="h-8 w-8 text-blue-500" />
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium group-hover:text-blue-500 transition-colors">Repository Analysis</span>
                <span className="text-sm text-muted-foreground">Comprehensive statistics and insights for each repository</span>
              </div>
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-4 group relative h-auto p-6 hover:bg-cyan-500/5">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <GitBranch className="h-8 w-8 text-cyan-500" />
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium group-hover:text-cyan-500 transition-colors">Commit Tracking</span>
                <span className="text-sm text-muted-foreground">Daily commit activity and contribution patterns</span>
              </div>
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-4 group relative h-auto p-6 hover:bg-teal-500/5">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Calendar className="h-8 w-8 text-teal-500" />
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium group-hover:text-teal-500 transition-colors">Timeline View</span>
                <span className="text-sm text-muted-foreground">Historical data and activity timeline</span>
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-8">
          <div className="grid gap-6">
            <Button variant="ghost" className="w-full justify-start gap-4 group relative h-auto p-6 hover:bg-cyan-500/5">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Star className="h-6 w-6 text-cyan-500" />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium group-hover:text-cyan-500 transition-colors">Repository Stars</span>
                <span className="text-sm text-muted-foreground">Track repository popularity and engagement</span>
              </div>
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-4 group relative h-auto p-6 hover:bg-teal-500/5">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-2 rounded-lg bg-teal-500/10">
                <GitFork className="h-6 w-6 text-teal-500" />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium group-hover:text-teal-500 transition-colors">Fork Count</span>
                <span className="text-sm text-muted-foreground">Monitor repository forks and usage</span>
              </div>
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-4 group relative h-auto p-6 hover:bg-emerald-500/5">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Calendar className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-medium group-hover:text-emerald-500 transition-colors">Commit History</span>
                <span className="text-sm text-muted-foreground">Analyze contribution patterns over time</span>
              </div>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 