import {TNSOTSessionI} from '../common';
import {TNSSessionListener} from './session-listener';
import {TNSOTPublisher} from './publisher';
import * as app from 'application';

declare var com: any, android: any;

const Session = com.opentok.android.Session;
const Subscriber = com.opentok.android.Subscriber;
const Publisher = com.opentok.android.Publisher;
const BaseVideoRenderer = com.opentok.android.BaseVideoRenderer;
const AbsoluteLayout = android.widget.AbsoluteLayout;
const RelativeLayout = android.widget.RelativeLayout;

export class TNSOTSession implements TNSOTSessionI {

    private apiKey: string;
    private subscriber: any;
    private sessionListener: any;

    public session: any;
    public publisher: any;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.bindSessionEvents(true);
        this.bindPublisherEvents(true);
    }

    public create(sessionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.apiKey) {
                console.log('API key not set. Please use the constructor to set the API key');
                reject('API Key Set');
            }
            this.session = new Session(app.android.context, this.apiKey, sessionId);
            this.session.setSessionListener(this.sessionListener);
            if (this.session) {
                console.log('OpenTok session: ' + this.session);
                resolve(true);
            }
            else {
                reject('OpenTok session creation failed.');
            }
        });
    }

    /**
     * Asynchronously begins the session connect process. Some time later, we will
     * expect a delegate method to call us back with the results of this action.
     *
     * @param {string} token The OpenTok token to join an existing session
     * @returns {Promise<any>}
     */
    public connect(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let session = this.session;
            if (session) {
                try {
                    session.connect(token);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    public disconnect(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    public publish(videoLocationX: number, videoLocationY: number, videoWidth: number, videoHeight: number) {
        if (this.session) {
            this.publisher.init(this.session, videoLocationX, videoLocationY, videoWidth, videoHeight);
        }
    }

    public subscribe(stream: any): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Stream Received: ' + stream);
            if (!this.subscriber) {
                this.subscriber = new Subscriber(app.android.context, stream);
                this.subscriber.setSubscriberListener(app.android.context);
                this.subscriber.getRenderer().setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE,
                    BaseVideoRenderer.STYLE_VIDEO_FILL);
                this.session.subscribe(this.subscriber);
            }
        });
    }

    public unsubscribe(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

    /**
     * Binds the custom session delegate for registering to existing events
     *
     * @param {boolean} [emitEvents=true] Whether to attach a custom event listener
     */
    bindSessionEvents(emitEvents:boolean = true) {
        this.sessionListener = new TNSSessionListener(emitEvents);
    }

    /**
     * Binds the custom publisher delegate for registering to existing events
     *
     * @param {boolean} [emitEvents=true] Whether to attach a custom event listener
     */
    bindPublisherEvents(emitEvents: boolean = true) {
        this.publisher = new TNSOTPublisher(emitEvents);
    }

    instance(): any {
        return this.sessionListener;
    }

}