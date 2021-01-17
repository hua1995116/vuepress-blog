# 构建

本章是对snowpack构建部分的讲解。有人可能还没明白 bundle 和 bundleless 的概念，以为 bundleless 就是不经过打包构建的，其实不然，区别在于是否利于浏览器的原生模块化机制，还是通过自己对模块化polyfill进行处理。而 snowpack 还是需要对一些高级的模式进行构建，例如 vue，jsx，scss，less 等。