/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Clients from "views/Clients/Clients";
import Artisans from "views/Artisans/Artisans";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import ClientTransactions from "views/Transactions/ClientTransactions";
import ArtisanTransactions from "views/Transactions/ArtisanTransactions";
import ClientJobs from "views/Jobs/ClientJobs";
import ArtisanJobs from "views/Jobs/ArtisanJobs";
import ClientProfiles from "views/Profiles/ClientProfiles";
import ArtisanProfiles from "views/Profiles/ArtisanProfiles";
import RegisterArtisan from "views/RegisterArtisan/RegisterArtisan";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import RegisterAdmin from "views/Admins/RegisterAdmin";
import Payments from "views/Payments/Payments";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/clients",
    name: "Clients",
    rtlName: "قائمة الجدول",
    icon: "group_work",
    component: Clients,
    layout: "/admin"
  },
  {
    path: "/client-profiles",
    name: "Client Profiles",
    rtlName: "قائمة الجدول",
    icon: "eco",
    component: ClientProfiles,
    layout: "/admin"
  },
  {
    path: "/client-transactions",
    name: "Client Transactions",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: ClientTransactions,
    layout: "/admin"
  },
  {
    path: "/client-jobs",
    name: "Jobs",
    rtlName: "قائمة الجدول",
    icon: "rowing",
    component: ClientJobs,
    layout: "/admin"
  },
  {
    path: "/artisans",
    name: "Artisans",
    rtlName: "قائمة الجدول",
    icon: "gavel",
    component: Artisans,
    layout: "/admin"
  },
  {
    path: "/artisan-profiles",
    name: "Artisan Profiles",
    rtlName: "قائمة الجدول",
    icon: "eco",
    component: ArtisanProfiles,
    layout: "/admin"
  },
  {
    path: "/artisan-transactions",
    name: "Artisan Transactions",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: ArtisanTransactions,
    layout: "/admin"
  },
  {
    path: "/payments-requests",
    name: "Payment Requests",
    icon: "rowing",
    component: Payments,
    layout: "/admin"
  },
  {
    path: "/register-artisan",
    name: "Register Artisan",
    rtlName: "قائمة الجدول",
    icon: "assignment",
    component: RegisterArtisan,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Admin Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/register-new-admin",
    name: "Create New Admin",
    icon: Person,
    component: RegisterAdmin,
    layout: "/admin"
  }
  // {
  //   path: "/table",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: "content_paste",
  //   component: TableList,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: BubbleChart,
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: LocationOn,
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/admin"
  // }
  // {
  //   path: "/rtl-page",
  //   name: "RTL Support",
  //   rtlName: "پشتیبانی از راست به چپ",
  //   icon: Language,
  //   component: RTLPage,
  //   layout: "/rtl"
  // }
  // {
  //   path: "/upgrade-to-pro",
  //   name: "Upgrade To PRO",
  //   rtlName: "التطور للاحترافية",
  //   icon: Unarchive,
  //   component: UpgradeToPro,
  //   layout: "/admin"
  // }
];

export default dashboardRoutes;
