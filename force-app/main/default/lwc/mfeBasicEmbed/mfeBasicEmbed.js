import { LightningElement, api } from 'lwc';

export default class MfeBasicEmbed extends LightningElement {
    @api baseUrl = 'https://aman06it.github.io/multiframework-recipes';
    debug = true;

    get computedSrc() {
        const url = new URL(this.baseUrl);
        url.pathname = `${url.pathname.replace(/\/$/, "")}/embedding/basic-embed`;
        return url.toString();
    }
}
