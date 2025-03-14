const candidateMenus = [
  {
    id: 1,
    name: "Dashboard",
    icon: "icon-chart-bar",
    routePath: "/candidates-dashboard/dashboard",
  },
  {
    id: 2,
    name: "My Profile",
    icon: "icon-user",
    routePath: "/candidates-dashboard/my-profile",
    subMenu: [
      {
        id: "2-1",
        name: "Details",
        routePath: "/candidates-dashboard/my-profile",
      },
      {
        id: "2-2",
        name: "Demo Video",
        routePath: "/candidates-dashboard/my-profile/LogoUpload",
      },
      {
        id: "2-3",
        name: "Resume",
        routePath: "/candidates-dashboard/cv-manager",
      },
      {
        id: "2-4",
        name: "View Profile",
        routePath: "/candidates-dashboard/my-profile/FullView.jsx",
      }
    ]
  },
  // {
  //   id: 3,
  //   name: "My Resume",
  //   icon: "icon-doc",
  //   routePath: "/candidates-dashboard/my-resume",
  // },
  {
    id: 4,
    name: "Applied Jobs",
    icon: "icon-task",
    routePath: "/candidates-dashboard/applied-jobs",
  },
  {
    id: 5,
    name: "Job Alerts",
    icon: "icon-bell",
    routePath: "/candidates-dashboard/job-alerts",
  },
  {
    id: 6,
    name: "Shortlisted Jobs",
    icon: "icon-bookmark",
    routePath: "/candidates-dashboard/shortlisted-jobs",
  },
  {
    id: 7,
    name: "CV Manager",
    icon: "icon-doc",
    routePath: "/candidates-dashboard/cv-manager",
  },
  {
    id: 8,
    name: "Messages",
    icon: "icon-envelope",
    routePath: "/candidates-dashboard/messages",
  },
  {
    id: 9,
    name: "Change Password",
    icon: "icon-lock",
    routePath: "/candidates-dashboard/change-password",
  },
  {
    id: 10,
    name: "Logout",
    icon: "icon-logout",
    routePath: "/candidates-dashboard/logout",
  },
];
export default candidateMenus;
