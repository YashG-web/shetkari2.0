import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Dashboard from "@/pages/Dashboard";
import LiveData from "@/pages/LiveData";
import Recommendation from "@/pages/Recommendation";
import Fertilizers from "@/pages/Fertilizers";
import CropAnalysis from "@/pages/CropAnalysis";
import PrecisionFarming from "@/pages/PrecisionFarming";
import PrecisionFarmingSatellite from "@/pages/PrecisionFarmingSatellite";
import Simulator from "@/pages/Simulator";
import Support from "@/pages/Support";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/live-data" component={LiveData} />
      <Route path="/recommendation" component={Recommendation} />
      <Route path="/fertilizer" component={Fertilizers} />
      <Route path="/crop-analysis" component={CropAnalysis} />
      <Route path="/precision-farming" component={PrecisionFarming} />
      <Route path="/precision-farming-satellite" component={PrecisionFarmingSatellite} />
      <Route path="/simulator" component={Simulator} />
      <Route path="/support" component={Support} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
