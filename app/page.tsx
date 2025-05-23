"use client";
import { useUser } from "@clerk/nextjs";
import Wrapper from "./components/Wrapper";
import ProductOverview from "./components/ProductOverview";
import CategoryChart from "./components/CategoryChart";
import RecentTrasactions from "./components/RecentTrasactions";
import StockSummaryTable from "./components/StockSummaryTable";

export default function Home() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  return (
    <Wrapper>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3">
          <ProductOverview email={email} />
          <CategoryChart email={email} />
          <RecentTrasactions email={email} />
        </div>
        <div className="md:ml-4 md:mt-0 mt-4 md:w-1/3">
          <StockSummaryTable email={email} />
        </div>
      </div>
    </Wrapper>
  );
}
