import { ChangeDetectorRef, Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import { CartService } from '../../services/cart.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { ProductService } from '../../services/product.service';
import { ProductType } from 'src/types/product.type';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  private _snackBar = inject(MatSnackBar)
  serverStaticPath = environment.serverStaticPath;

  searchField = new FormControl()
  showedSearch: boolean = false
  products: ProductType[] = []
  isLogged: boolean = false
  count: number = 0

  @Input() categories: CategoryWithTypeType[] = []

  constructor(private authService: AuthService, private router: Router, private cartService: CartService, private productService: ProductService, private cdr: ChangeDetectorRef) {
    this.isLogged = authService.getIsLoggedIn()
  }

  ngOnInit(): void {

    this.cartService.getCartCount().subscribe((data: {count: number} | DefaultResponseType) => {
      if((data as DefaultResponseType).error !== undefined){
        throw new Error(((data as DefaultResponseType).message))
      }
      console.log(data)
      this.count = (data as {count: number}).count
      console.log(this.count)
    })
    
    
    this.cartService.count$.subscribe(count => {
      this.count = count
    })

    this.searchField.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      if(value && value.length > 2){
        this.productService.searchProducts(value).subscribe((data: ProductType[]) => {
          this.products = data
          this.showedSearch = true
        })
      } else{
        this.products = []
      }
    })

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) =>{
      this.isLogged = isLoggedIn
      if(this.isLogged){
        this.cartService.getCartCount().subscribe((data: {count: number} | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined){
            throw new Error(((data as DefaultResponseType).message))
          }
          console.log(data)
          this.count = (data as {count: number}).count
          console.log(this.count)
        })
      }
    })
  }

  logout(){
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout()
        this.cartService.getCartCount().subscribe((data: {count: number} | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined){
            throw new Error(((data as DefaultResponseType).message))
          }
          console.log(data)
          this.count = (data as {count: number}).count
          console.log(this.count)
        })
      },
      error: () => {
        this.doLogout()
        this.cartService.getCartCount().subscribe((data: {count: number} | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined){
            throw new Error(((data as DefaultResponseType).message))
          }
          console.log(data)
          this.count = (data as {count: number}).count
          console.log(this.count)
        })
      } 
    })
  }

  doLogout(){
    this.authService.removeTokens()
    this.authService.userId = null
    this._snackBar.open("Вы вышли из системы")
    this.router.navigate(["/"])
  }

  // changedSearchValue(value: string){
  //   this.searchValue = value

  //   if(this.searchValue && this.searchValue.length > 2){
  //     this.productService.searchProducts(this.searchValue).subscribe((data: ProductType[]) => {
  //       this.products = data
  //       this.showedSearch = true
  //     })
  //   } else{
  //     this.products = []
  //   }
  // }

  selectProduct(url: string){
    this.router.navigate(["/product/" + url])
    this.searchField.setValue("")
    this.products = []
  }

  @HostListener("document:click", ["$event"])
  click(event: Event) {
  if (this.showedSearch && !(event.target as HTMLElement).classList.contains("search-product")) {
    this.showedSearch = false;
  }
}
}
