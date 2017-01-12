import RPCProvider from 'web3-provider-engine/subproviders/rpc';
import createPayload from 'web3-provider-engine/util/create-payload';
const xhr = process.browser ? require('xhr') : require('request');

export default class SigmateSubprovider extends RPCProvider {
  handleRequest(payload, next, end) {
    const self = this;
    const targetUrl = self.rpcUrl;
    const method = payload.method;

    // new payload with random large id,
    // so as not to conflict with other concurrent users
    const newPayload = createPayload(payload);

    // console.log('------------------ network attempt -----------------')
    // console.log(payload)
    // console.log('---------------------------------------------')

    xhr({
      uri: targetUrl,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPayload),
      rejectUnauthorized: false,
    }, (err, res, body) => {
      if (err) { console.log(err); }
      if (err) return end(err);
      if (res.statusCode !== 200) {
        const message = `HTTP Error: ${res.statusCode} on ${method}`;
        console.log(message);
        return end(new Error(message));
      }
      // parse response into raw account
      let data;
      try {
        data = JSON.parse(body);
        if (data.error) { console.log(data.error); }
        if (data.error) return end(data.error);
      } catch (err2) {
        console.error(err.stack);
        return end(err2);
      }
      console.log('network:', payload.method, payload.params, '->', data.result);
      return end(null, data.result);
    });
  }
}
