import LayoutDrawer from './layout/drawer.vue'
import LayoutList from './layout/list.vue'
import SearchBar from './searchBar/index.vue'
import TableSelection from './tableSelection/index.vue'

export default {
    install(app: any) {
        app.component('LayoutDrawer', LayoutDrawer)
        app.component('LayoutList', LayoutList)
        app.component('SearchBar', SearchBar)
        app.component('TableSelection', TableSelection)
    }
}