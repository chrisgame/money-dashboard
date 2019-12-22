import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

const CATEGORIES = [
  'transport',
  'groceries',
  'eating out',
  'finances',
  'bills',
  'entertainment',
  'holidays',
  'shopping',
  'general',
  'expenses',
  'family',
  'personal care',
  'charity'
];

export default Factory.extend({
  created() {
    return faker.date.past();
  },
  description() {
    return faker.company.companyName();
  },
  amount() {
    return faker.random.number();
  },
  fees() {},
  currency() {
    return faker.finance.currencyCode();
  },
  merchant() {
    return null;
  },
  notes() {
    return faker.random.words();
  },
  metadata() {
    return {
      notes: faker.random.words(),
      originator_type: 'prepaid-balance-migration',
      prepaid_bridge_transfer_id: 'prepaidtransfer_00009TBy6079mVSGGRA1hp'
    }
  },
  labels() {
    return null;
  },
  accountBalance() {
    return 0;
  },
  attachments() {
    return [];
  },
  international() {
    return null;
  },
  category() {
    return faker.random.arrayElement(CATEGORIES);
  },
  categories() {
    return null;
  },
  isLoad() {
    return false;
  },
  settled() {
    return faker.date.past();
  },
  localAmount() {
    return faker.random.number();
  },
  localCurrency() {
    return faker.finance.currencyCode();
  },
  updated() {
    return faker.date.past();
  },
  accountId() {
    return 'acc_00009T9lotTzb5Bn0Vzxsv';
  },
  userId() {
    return '';
  },
  counterparty() {
    return {};
  },
  scheme() {
    return 'prepaid-bridge';
  },
  dedupeId() {
    return 'prepaid_migration:user_000095G4zjj6AGQSyLB0V7';
  },
  originator() {
    return false;
  },
  includeInSpending() {
    return true;
  },
  canBeExcludedFromBreakdown() {
    return false;
  },
  canBeMadeSubscription() {
    return false;
  },
  canSplitTheBill() {
    return false;
  },
  canAddToTab() {
    return false;
  },
  amountIsPending() {
    false;
  },
});
