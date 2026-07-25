import CallHistory from '../models/CallHistory.js';

// @desc    Get user's call history
// @route   GET /api/calls/history
// @access  Private
export const getCallHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const calls = await CallHistory.find({
      $or: [{ caller: userId }, { receiver: userId }]
    })
      .populate('caller', 'fullName username profilePic')
      .populate('receiver', 'fullName username profilePic')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch call history', error: error.message });
  }
};

// @desc    Delete a call record
// @route   DELETE /api/calls/:id
// @access  Private
export const deleteCallRecord = async (req, res) => {
  try {
    const callId = req.params.id;
    const call = await CallHistory.findById(callId);
    
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    if (call.caller.toString() !== req.user._id.toString() && call.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this record' });
    }

    await call.deleteOne();
    res.status(200).json({ message: 'Call record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete call record', error: error.message });
  }
};
