import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixion } from 'lightning/navigation';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats'; 

export default class SimilarBoats extends NavigationMixin(LightningElement) {

    //Private
    currentBoat;
    relatedBoats;
    @track boatId;
    error;

    @api
    get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

    // public
    @api
    similarBy;

    // Wire the custom Apex call using the import getSimilarBoats
    // Populates the related boats list
    @wire(getSimilarBoats, {boatId: '$boatId', similarBy: '$similarBy'})
        similarBoats({error, data}) {
            if(data) {
                this.relatedBoats = data;
            } else if (error) {
                this.error = error;
            }
        }

    get getTitle() {
        return 'Similar boats by ' + this.similarBy;
    }

    get noBoats() {
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }

    // Navigate to Record Page
    openBoatDetailPage(event) {
        this.currentBoat = event.detail.boatId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.currentBoat,
                objectApiName: 'Boat__c',
                actionName: 'view'
            }
        });
    }


}