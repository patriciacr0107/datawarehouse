module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(e => {
      console.log('res ', res);
      res.status(500).json({
        status: 'error',
        requestedAt: req.requestTime,
        results: 'res',
      });
      next
    }
    );
  };
};
