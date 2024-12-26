import mongoose, { Schema, Model } from 'mongoose';
import { Confession, Reply } from '@/types';

// Reply Schema
const ReplySchema = new Schema<Reply>({
    id: { type: String, required: true },
    confessionId: { type: String, required: true, index: true },
    content: { type: String, required: true, maxlength: 500 },
    timestamp: { type: Number, required: true, default: Date.now },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
});

// Confession Schema
const ConfessionSchema = new Schema<Confession>(
    {
        id: { type: String, required: true, unique: true, index: true },
        content: { type: String, required: true, maxlength: 500 },
        timestamp: { type: Number, required: true, default: Date.now },
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
        replies: { type: [ReplySchema], default: [] },
        tags: { type: [String], default: [] }, // Index defined separately below
        isReported: { type: Boolean, default: false },
        reportCount: { type: Number, default: 0 },
        ip: { type: String, select: false }, // Don't return IP by default
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
        collection: 'confessions',
    }
);

// Indexes for better query performance
ConfessionSchema.index({ timestamp: -1 });
ConfessionSchema.index({ upvotes: -1, downvotes: 1 }); // For trending
ConfessionSchema.index({ tags: 1 });
ConfessionSchema.index({ isReported: 1, reportCount: -1 });
ConfessionSchema.index({ content: 'text', tags: 'text' }); // Text search

// Virtual for score calculation
ConfessionSchema.virtual('score').get(function () {
    return this.upvotes - this.downvotes;
});

// Instance methods
ConfessionSchema.methods.addReply = function (reply: Reply) {
    this.replies.push(reply);
    return this.save();
};

ConfessionSchema.methods.incrementUpvotes = function () {
    this.upvotes += 1;
    return this.save();
};

ConfessionSchema.methods.incrementDownvotes = function () {
    this.downvotes += 1;
    return this.save();
};

ConfessionSchema.methods.decrementUpvotes = function () {
    if (this.upvotes > 0) this.upvotes -= 1;
    return this.save();
};

ConfessionSchema.methods.decrementDownvotes = function () {
    if (this.downvotes > 0) this.downvotes -= 1;
    return this.save();
};

ConfessionSchema.methods.report = function () {
    this.isReported = true;
    this.reportCount = (this.reportCount || 0) + 1;
    return this.save();
};

// Static methods
ConfessionSchema.statics.getTrending = function (limit: number = 10) {
    return this.find({ isReported: { $ne: true } })
        .sort({ upvotes: -1, downvotes: 1, timestamp: -1 })
        .limit(limit)
        .exec();
};

ConfessionSchema.statics.searchConfessions = function (query: string) {
    return this.find(
        {
            $or: [
                { content: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
            ],
            isReported: { $ne: true },
        },
        null,
        { sort: { timestamp: -1 } }
    ).exec();
};

ConfessionSchema.statics.getReported = function () {
    return this.find({
        $or: [{ isReported: true }, { reportCount: { $gt: 0 } }],
    })
        .sort({ reportCount: -1 })
        .exec();
};

// Export the model
export const ConfessionModel: Model<Confession> =
    mongoose.models.Confession || mongoose.model<Confession>('Confession', ConfessionSchema);
