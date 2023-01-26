import { Routes, DefaultRoute } from './routes'

m.route.prefix = '';

/* Wire up mithril app to DOM */
const $root = document.body.querySelector('#app')
m.route($root, DefaultRoute, Routes)