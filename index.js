const request = require('request');

function sendSignal (req, res) {
  // {"count":"2", "clientkey":"hoge", "deviceid":"fuga", "signal":"signal JSON"}

  const createCounter = () => {
    let privateCount = 0;
    return () => {
        privateCount++;
        return privateCount;
    };
  };

  const counter = createCounter();

  const timer = setInterval(function (){
    const count = counter();

    const options = {
      uri: "https://api.getirkit.com/1/messages",
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      body: `clientkey=${req.body.clientkey}&deviceid=${req.body.deviceid}&message=${JSON.stringify(req.body.signal)}`
    };

    console.log("sending signal...");
    request.post(options, function (error){
      if (error) {
        res.status(500);
        res.end('Internal Server Error');
        clearInterval(timer);
      }
    });

    if(count >= req.body.count){
      res.status(200).end();
      clearInterval(timer);
    }
  }, 5000);
}

function handlePOST (req, res) {
  switch (req.get('content-type')) {
    case 'application/json':
      sendSignal(req, res);
      break;
    default:
      res.status(500).send({ error: 'Only JSON is accepted.' });
      break;
  }
}

exports.helloHttp = (req, res) => {
  switch (req.method) {
    case 'POST':
      handlePOST(req, res);
      break;
    default:
      res.status(500).send({ error: 'Only POST is accepted.' });
      break;
  }
};
