import { Injectable } from '@nestjs/common';
import { CatDto as Cat } from './catDto';
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  createCat(cat: Cat) {
    const newCat = {
      name: cat.name,
      age: +cat.age,
      breed: cat.breed,
    };
    this.cats.push(newCat);
    return 'Cat pushed';
  }

  findAllCats() {
    return this.cats;
  }

  findSingleCat(age) {
    console.log('from service', age);
    // Return one cat

    // Return a single cat object based off age
    return this.cats.find((cat) => cat.age === age);
  }
}
