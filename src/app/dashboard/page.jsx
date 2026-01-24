import { checkUser } from "@/lib/checkUser";
import { DashboardContent } from "./_components/DashboardContent";

export default async function DashboardPage() {
  const user = await checkUser();

  const firstName =
    user?.found && user?.loggedInUser?.[0]?.name
      ? user.loggedInUser[0].name.split(" ")[0]
      : user?.newUser?.[0]?.name
      ? user.newUser[0].name.split(" ")[0]
      : "there";

  return <DashboardContent firstName={firstName} />;
}
