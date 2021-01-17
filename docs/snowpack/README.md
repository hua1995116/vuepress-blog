# snowpack 技术揭秘

本教程是对 snowpack 源码的一些分析。现阶段随着 vue 3.0、vite 的诞生，bundleless 的声响已经越来越高了，snowpack 是一个比较早期的 bundleless 的工具，本教程就是用来分析 snowpack 的源码。

主要通过 解析，构建，热更新 三个部分来进行讲解。在最后尝试写一个在线的 bundleless 工具。