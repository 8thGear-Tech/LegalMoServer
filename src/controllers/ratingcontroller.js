import { Rating } from "../models/ratingmodel";

export const addRating = async (req, res) => {
    const { companyId, productId, review, status } = req.body;
    const rating = new Rating({
        companyId,
        productId,
        review,
        status,
    });
    try {
        await rating.save();
        res.status(201).json(rating);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
    };

export const getRatings = async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.status(200).json(ratings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getRating = async (req, res) => {
    const { id } = req.params;
    try {
        const rating = await Rating.findById(id);
        res.status(200).json(rating);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateRating = async (req, res) => {
    const { id } = req.params;
    const { companyId, productId, review, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No rating with id: ${id}`);
    const updatedRating = { companyId, productId, review, status, _id: id };
    await Rating.findByIdAndUpdate(id, updatedRating, { new: true });
    res.json(updatedRating);
};

export const deleteRating = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No rating with id: ${id}`);
    await Rating.findByIdAndRemove(id);
    res.json({ message: "Rating deleted successfully." });
};

export const getRatingsByCompany = async (req, res) => {
    const { companyId } = req.params;
    try {
        const ratings = await Rating.find({ companyId: companyId });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getRatingsByProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const ratings = await Rating.find({ productId: productId });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getRatingsByCompanyAndProduct = async (req, res) => {
    const { companyId, productId } = req.params;
    try {
        const ratings = await Rating.find({ companyId: companyId, productId: productId });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getRatingsByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const ratings = await Rating.find({ status: status });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


