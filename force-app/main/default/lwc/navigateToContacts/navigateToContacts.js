import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NavigateToContacts extends NavigationMixin(LightningElement) {
    // Navigate to the Contacts tab (the object's list view).
    handleNavigate() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'list',
            },
            state: {
                // Open the "All Contacts" list view.
                filterName: 'AllContacts',
            },
        });
    }
}
