import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    { state: 'dashboard', name: 'Dashbaord', icon: 'dashboard', role: '' },
    { state: 'category', name: 'Manage Category', icon: 'category', role: 'admin' },
    { state: 'product', name: 'Manage Product', icon: 'inventory_2', role: 'admin' },
    { state: 'order', name: 'Manage Orders', icon: 'list_alt', role: '' },
    { state: 'bill', name: 'View Bills', icon: 'list_alt', role: '' },
    { state: 'user', name: 'Manage User', icon: 'supervised_user_circle', role: 'admin' },


]

@Injectable()
export class MenuItems {
    getMenuItems(): Menu[] {
        return MENUITEMS;
    }
}