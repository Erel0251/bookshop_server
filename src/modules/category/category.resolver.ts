import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Category } from '../category/entities/category.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Book } from '../book/entities/book.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  async book(@Args('id', ParseUUIDPipe) id: string): Promise<Category> {
    return (await this.categoryService.findOne(id)) as Category;
  }

  @ResolveField(() => [Category], { name: 'children', nullable: true })
  async authors(@Parent() book: Category): Promise<Category[]> {
    return await this.categoryService.findChildrenCategory(book.id);
  }

  @ResolveField(() => Category, { name: 'father', nullable: true })
  async father(@Parent() category: Category): Promise<Category> {
    return await this.categoryService.findFatherCategory(category.id);
  }

  @ResolveField(() => [Book], { name: 'books', nullable: true })
  async books(@Parent() category: Category): Promise<Book[]> {
    return await this.categoryService.findBooksByCategory(category.id);
  }

  @ResolveField(() => String, { name: 'id' })
  resolveId(category: Category): string {
    return category.id;
  }
}
