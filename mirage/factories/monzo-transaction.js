import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

const CATEGORIES = [
  'transport',
  'groceries',
  'eating_out',
  'finances',
  'bills',
  'entertainment',
  'holidays',
  'shopping',
  'general',
  'expenses',
  'family',
  'personal_care',
  'charity',
  'cash'
];

export default Factory.extend({
  accountBalance() {
    return 0;
  },
  amount() {
    return faker.random.number({ min:-30000000, max: -1 });
  },
  created() {
    return faker.date.past();
  },
  currency() {
    return faker.finance.currencyCode();
  },
  description() {
    return `${faker.company.companyName()} ${faker.finance.currencyCode()}`;
  },
  merchant() {
    return {
      logo: 'https://pbs.twimg.com/profile_images/527043602623389696/68_SgUWJ.jpeg',
      emoji: '😀',
      name: faker.company.companyName(),
      category: faker.random.arrayElement(CATEGORIES),
    };
  },
  metadata() {
    return null;
  },
  notes() {
    return faker.random.words();
  },
  isLoad() {
    return false;
  },
  settled() {
    return faker.date.past();
  },
});
