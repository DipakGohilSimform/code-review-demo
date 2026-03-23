import { Button, Card, CardContent, CardIcon } from "@/components";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import { NotificationsPanel } from "./NotificationsPanel";
import { UserProfileWidget } from "./UserProfileWidget";
import { DollarSign, TrendingUp } from "lucide-react";

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Demo</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <Button>Add New</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={"2,543"}
          delta={"+12% from last month"}
          deltaColor="green"
        />
        <StatsCard
          title="Revenue"
          value={"$45,231"}
          delta={"+8% from last month"}
          deltaColor="green"
        />
        <StatsCard title="Active Projects" value={12} smallText={"3 completed"} />
        <StatsCard title="Tasks Pending" value={24} delta={"8 overdue"} deltaColor="red" />
        <StatsCard
          title="Total Users"
          value={"2,543"}
          delta={"+12% from last month"}
          deltaColor="green"
        />
        <StatsCard
          title="Revenue"
          value={"$45,231"}
          delta={"+8% from last month"}
          deltaColor="green"
        />
        <StatsCard title="Active Projects" value={12} smallText={"3 completed"} />
        <StatsCard title="Tasks Pending" value={24} delta={"8 overdue"} deltaColor="red" />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        <RecentActivity />
      </div>

      <Card>
        <CardContent className="flex items-center gap-4">
          <CardIcon icon={TrendingUp} />
          <CardIcon
            icon={DollarSign}
            containerClassName="bg-primary"
            className="text-primary-foreground"
          />
        </CardContent>
      </Card>

      <img src="https://picsum.photos/200/300" alt="img" />
      {/* <ProvidersTable/> */}

      {/* Notifications + Profile widgets for code-review testing */}
      <div className="flex flex-wrap gap-6">
        <NotificationsPanel onDismiss={() => console.log("dismissed")} />
        <UserProfileWidget
          userId={1}
          name="Alex Johnson"
          email="alex@example.com"
          role={"admin" as any}
          avatarUrl="https://i.pravatar.cc/150?img=3"
          bio="<strong>Senior Engineer</strong> — loves clean code <script>alert('xss')</script>"
          onSave={(d: any) => console.log(d)}
          onDelete={() => console.log("deleted")}
        />
      </div>
    </div>
  );
}

export default DashboardOverview;
