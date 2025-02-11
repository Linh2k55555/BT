import { Transaction } from "../transaction/model";

// Lấy lịch sử giao dịch của người dùng
export const getTransactionHistory = async (req, res) => {
    const { userId } = req.session;

    if (!userId) {
        return res.status(401).redirect('/login');
    }

    try {
        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
        res.render('transaction-history', {
            user: req.user || {},
            transactions,
        });
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử giao dịch:", error);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};
