import { MongooseStatics, MongooseStamps } from '../utils/mongoTypes';
import { PermissionGroupNames } from '../permissionTypes';
import mongoose from 'mongoose';
export interface Classifier {
    owner: string | mongoose.Types.ObjectId;
}
export interface Editable {
    name: string;
    description?: string;
    permission_groups: PermissionGroupNames[];
}
export interface PlainRole extends Editable, MongooseStamps, MongooseStatics, Classifier {
}
export interface Mongoose extends Editable, MongooseStamps, MongooseStatics, Classifier {
}
