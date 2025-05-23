import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductType } from 'src/types/product.type';
import { CartService } from '../../services/cart.service';
import { CartType } from 'src/types/cart.type';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoriteService } from '../../services/favorite.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavoriteType } from 'src/types/favorite.type';
import { Router } from '@angular/router';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductType;
  @Input() isLight: boolean = false;
  @Input() countInCart: number | undefined = 0;
  isLogged: boolean = false

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private favoriteService: FavoriteService,
    private router: Router
  ) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  serverStaticPath = environment.serverStaticPath;
  count: number = 1;
  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

  addToCart() {
    this.cartService
      .updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        this.countInCart = this.count;
      });
  }

  updateCount(value: number) {
    this.count = value;
    console.log(this.count);
    if (this.countInCart) {
      this.cartService
        .updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          this.countInCart = this.count;
        });
    }
  }

  removeFromCart() {
    this.cartService
      .updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        this.countInCart = 0;
        this.count = 1;
      });
  }

  updateFavorite() {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open(
        'Для добавления в избранное необходимо авторизоваться'
      );
      return;
    }

    if (this.product.isInFavorite) {
      this.favoriteService
        .removeFavorite(this.product.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            throw new Error(data.message);
          }

          this.product.isInFavorite = false;
        });
    } else {
      this.favoriteService
        .addFavorite(this.product.id)
        .subscribe((data: FavoriteType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.product.isInFavorite = true;
        });
    }
  }

  navigate() {
    if (this.isLight) {
      this.router.navigate(['/product/' + this.product.url])
    }
  }
}
