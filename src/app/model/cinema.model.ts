import { CinemaInterface } from "@interfaces/interfaces";
import Utils from "@model/utils.class";

export default class Cinema {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public slug: string | null = null
  ) {}

  fromInterface(c: CinemaInterface): Cinema {
    this.id = c.id;
    this.name = Utils.urldecode(c.name);
    this.slug = c.slug;

    return this;
  }

  toInterface(): CinemaInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      slug: this.slug,
    };
  }
}
