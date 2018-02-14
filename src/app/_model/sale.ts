import { Item } from './index';
import { SaleItem } from './index';
import { PaymentMethod } from './index';

export class Sale {
  id: string;
  date: Date;
  total: number;
  paymentmethod: PaymentMethod;
  active: number;
  saleitem_set: SaleItem[];

  constructor() {
    this.total = 0;
    this.saleitem_set = new Array<SaleItem>();
  }

  add(item: Item, n = 1) {
    let saleitem: SaleItem;
    saleitem = this.saleitem_set.find(x => x.item === item);

    if (saleitem !== undefined) {
      saleitem.quantity += n;
    }else {
      saleitem = new SaleItem();
      saleitem.item = item;
      saleitem.price = item.price;
      saleitem.quantity = n;
      this.saleitem_set.push(saleitem);
    }
    this.calculateTotal();
  }

  sub(item: Item, n = 1) {
    let saleitem: SaleItem;
    saleitem = this.saleitem_set.find(x => x.item === item);

    if (saleitem !== undefined) {
      saleitem.quantity -= n;
      if (saleitem.quantity <= 0) {
        this.saleitem_set.splice(this.saleitem_set.indexOf(saleitem), 1);
      }
      this.calculateTotal();
    }
  }

  del(item: Item) {
    let saleitem: SaleItem;
    saleitem = this.saleitem_set.find(x => x.item === item);

    if (saleitem !== undefined) {
      this.saleitem_set.splice(this.saleitem_set.indexOf(saleitem), 1);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    let total = 0;
    for (const saleitem of this.saleitem_set) {
      total += saleitem.price * saleitem.quantity;
    }
    this.total = total;
  }

}
