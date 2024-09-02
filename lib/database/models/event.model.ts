import { Document, model, models, Schema } from "mongoose";

export interface IEvent extends Document {
    _id: String;
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    price?: string;
    isFree: boolean;
    url?: string;
    category: {
        _id: string,
        name: String
    };
    organizer: {
        _id: string,
        firstName: String
        lastName: String
    };
}

const EventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
    },
    location: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    startDateTime: {
        type: Date,
        default: Date.now,
    },
    endDateTime: {
        type: Date,
        default: Date.now,
    },
    price: {
        type: String,
    },
    isFree: {
        trype: Boolean,
        default: false
    },
    url: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Catergory'
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
})

const Event = models.Event || model('Event', EventSchema)

export default Event