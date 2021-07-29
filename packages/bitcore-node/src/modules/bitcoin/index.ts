import { BaseModule } from '..';
import { BTCStateProvider } from '../../providers/chain-state/btc/btc';
import { BitcoinP2PWorker } from './p2p';
import { VerificationPeer } from './VerificationPeer';

export default class BitcoinModule extends BaseModule {
  constructor(services: BaseModule['bitcoreServices']) {
    super(services);
    services.Libs.register('FLO', 'bitcore-lib', 'bitcore-p2p');
    services.P2P.register('FLO', BitcoinP2PWorker);
    services.CSP.registerService('FLO', new BTCStateProvider());
    services.Verification.register('FLO', VerificationPeer);
  }
}
