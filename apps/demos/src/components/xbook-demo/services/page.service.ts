import { createReactBean } from "rx-bean";
import { useStateFromObservable } from "rx-nested-bean";
import { map } from "rxjs";
import { typedKey } from "@playground/app-toolkit";

export interface IPage {
  id: string;
  title: string;
  content: string;
}

export const PageServiceToken = typedKey<PageService>("PageService");

export class PageService {
  private pageController = createReactBean("PageList", [] as IPage[]);

  getPageList = this.pageController.getPageList;

  setPageList = this.pageController.setPageList;

  usePageList = this.pageController.usePageList;

  pageList$ = this.pageController.PageList$;

  addPage = (page: IPage) => {
    this.pageController.setPageList([...this.getPageList(), page]);
  };

  updatePage = (partialPage: Partial<IPage>) => {
    this.pageController.setPageList(
      this.getPageList().map((p) =>
        p.id === partialPage.id ? { ...p, ...partialPage } : p
      )
    );
  };

  deletePage = (id: string) => {
    this.pageController.setPageList(
      this.getPageList().filter((p) => p.id !== id)
    );
  };

  getPage = (id: string) => {
    return this.getPageList().find((p) => p.id === id);
  };

  getPage$ = (id: string) => {
    return this.pageList$.pipe(map((pages) => pages.find((p) => p.id === id)));
  };

  usePage = (id: string) => {
    return useStateFromObservable(this.getPage$(id), this.getPage(id));
  };
}
