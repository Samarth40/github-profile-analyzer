import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UserProfile from "./components/UserProfile"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark min-h-screen w-full bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <UserProfile />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
