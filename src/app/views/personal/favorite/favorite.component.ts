import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { environment } from 'src/environments/environment';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavoriteType } from 'src/types/favorite.type';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  favorites: FavoriteType[] = []
  cart: CartType | null = null

  serverStaticPath: string = environment.serverStaticPath

  constructor(private favoriteService: FavoriteService, private _snackBar: MatSnackBar, private cartService: CartService) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
      if((data as DefaultResponseType).error !== undefined){
        const error = (data as DefaultResponseType).message
        this._snackBar.open(error)
        throw new Error(error)
      }

      this.favorites = data as FavoriteType[]

    this.cartService.getCart().subscribe((data: CartType | DefaultResponseType) => {
      if((data as DefaultResponseType).error !== undefined){
        throw new Error(((data as DefaultResponseType).message))
      }
      this.cart = data as CartType
      this.favorites = this.favorites.map(favorite => {
        const match = this.cart?.items.find(item => item.product.id === favorite.id)
        return match ? {...favorite, quantity: match.quantity} : {...favorite, quantity: 0}
      })
      console.log(this.favorites)
    })
    })
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id).subscribe((data: DefaultResponseType) => {
      if(data.error){

        throw new Error(data.message)
      }

      this.favorites = this.favorites.filter(item => item.id !== id)
    })
  }
  
  favoriteButton(favorite: FavoriteType){
    if(favorite.quantity > 0){
      return "В корзине"
    } else{
      return "В корзину"
    }
  }

}
