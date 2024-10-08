import { DBConfig } from 'ngx-indexed-db';


export const dbConfig: DBConfig = {
  name: 'MyAppsDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'investmentTrackers',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'defaultCurrency', keypath: 'defaultCurrency', options: { unique: false } },
        { name: 'defaultInterestRate', keypath: 'defaultInterestRate', options: { unique: false } },
        { name: 'description', keypath: 'description', options: { unique: false } },
        { name: 'createdOn', keypath: 'createdOn', options: { unique: false } },
        { name: 'updatedOn', keypath: 'updatedOn', options: { unique: false } },
        { name: 'updateMessage', keypath: 'updateMessage', options: { unique: false } },
        { name: 'updateNotificationId', keypath: 'updateNotificationId', options: { unique: false } },
      ]
    },
    {
      store: 'investments',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'amount', keypath: 'amount', options: { unique: false } },
        { name: 'interestRate', keypath: 'interestRate', options: { unique: false } },
        { name: 'investedOn', keypath: 'investedOn', options: { unique: false } },
        { name: 'isCredit', keypath: 'isCredit', options: { unique: false } },
        { name: 'trackerId', keypath: 'trackerId', options: { unique: false } },
        { name: 'createdOn', keypath: 'createdOn', options: { unique: false } }
      ]
    }
  ]
};
