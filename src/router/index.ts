import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/administrators",
    name: "System",
    meta: {
      title: "系统",
      elIcon: "Setting"
    },
    children: [
      {
        path: "administrators",
        component: () => import("@/views/system/administrator/index.vue"),
        name: "Administrators",
        meta: {
          title: "管理员",
        }
      },
      {
        path: "administrators/add",
        component: () => import("@/views/system/administrator/add.vue"),
        name: "AdministratorAdd",
        meta: {
          title: "添加管理员",
        }
      },
      {
        path: "administrators/:id/edit",
        component: () => import("@/views/system/administrator/edit.vue"),
        name: "AdministratorEdit",
        meta: {
          title: "编辑管理员",
          hidden: true
        }
      },
    ]
  },
  {
    path: "/article",
    component: Layout,
    redirect: "/article/articles",
    name: "Article",
    meta: {
      title: "文章管理",
      elIcon: "Notebook"
    },
    children: [
      {
        path: "articles",
        component: () => import("@/views/article/article/index.vue"),
        name: "Articles",
        meta: {
          title: "文章列表",
        }
      },
      {
        path: "tags",
        component: () => import("@/views/article/tag/index.vue"),
        name: "Tags",
        meta: {
          title: "标签管理",
        }
      },
      {
        path: "categories",
        component: () => import("@/views/article/category/index.vue"),
        name: "Categories",
        meta: {
          title: "分类管理",
        }
      },
    ]
  },
  {
    path: "/config",
    component: Layout,
    redirect: "/config/sites",
    name: "Config",
    meta: {
      title: "配置管理",
      elIcon: "Tools"
    },
    children: [
      {
        path: "sites",
        component: () => import("@/views/config/site/index.vue"),
        name: "Sites",
        meta: {
          title: "站点配置",
        }
      },
      {
        path: "guestbook",
        component: () => import("@/views/config/guestbook/index.vue"),
        name: "Guestbook",
        meta: {
          title: "留言版",
        }
      },
      {
        path: "about",
        component: () => import("@/views/config/about/index.vue"),
        name: "About",
        meta: {
          title: "关于",
        }
      },

    ]
  },
  {
    path: "/other",
    component: Layout,
    redirect: "/other/comments",
    name: "Other",
    meta: {
      title: "其它",
      elIcon: "Memo"
    },
    children: [
      {
        path: "comments",
        component: () => import("@/views/other/comment/index.vue"),
        name: "Comments",
        meta: {
          title: "评论管理",
        }
      },
      {
        path: "friendships",
        component: () => import("@/views/other/friendship/index.vue"),
        name: "Friendships",
        meta: {
          title: "友情链接",
        }
      },
      {
        path: "sentences",
        component: () => import("@/views/other/sentence/index.vue"),
        name: "Sentences",
        meta: {
          title: "每日一句",
        }
      },

    ]
  },
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // {
  //   path: "/permission",
  //   component: Layout,
  //   redirect: "/permission/page",
  //   name: "Permission",
  //   meta: {
  //     title: "权限管理",
  //     svgIcon: "lock",
  //     roles: ["admin", "editor"], // 可以在根路由中设置角色
  //     alwaysShow: true // 将始终显示根菜单
  //   },
  //   children: [
  //     {
  //       path: "page",
  //       component: () => import("@/views/permission/page.vue"),
  //       name: "PagePermission",
  //       meta: {
  //         title: "页面权限",
  //         roles: ["admin"] // 或者在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: "directive",
  //       component: () => import("@/views/permission/directive.vue"),
  //       name: "DirectivePermission",
  //       meta: {
  //         title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
  //   redirect: "/404",
  //   name: "ErrorPage",
  //   meta: {
  //     hidden: true
  //   }
  // }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
