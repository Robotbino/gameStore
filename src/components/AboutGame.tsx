import { useState } from "react";
import type { Game } from "../assets/gameData";

interface AboutGames{
    items:Game;
}

export default function AboutGames({items}: AboutGames){

  const renderGenre = (genre: string[]) => {
  
   return(
     <div className="aboutGenreContainer">
    {[...Array(Array.length)].map((_, i) => (
          <div key={i}
           className="descriptionGenre">
            #{items.genre[i]}
          </div>
        ))}
    </div>
   );
  };
   const renderStars = (rating: number) => {
   const fullStars = Math.floor(rating);
   const hasHalfStar = rating % 1 >= 0.5;
  
   return(
    <div className="aboutRatingContainer">
    {[...Array(5)].map((_, i) => (
          <span key={i} className={
            i < fullStars ? "aboutStar filled" : 
            (i === fullStars && hasHalfStar) ? "aboutStar half" : "star"
          }>
            ★
          </span>
        ))}
      <span className="aboutRating-number">{rating.toFixed(1)}</span>
    </div>
   );
  };
    
    return(
       <div>
        <div className="aboutMeContainer" >
            <div className="mainAboutSection">
                <img className="aboutGameImage" src={items.imageUrl}/>
                <div className="descriptionBlock">
                        <div className="descriptionHeader">{items.title}</div>
                        <div>
                            {renderGenre(items.genre)}
                        </div>
                        <p className="descriptionSection">
                            {items.description}
                        </p>
                        
                    <div className="aboutSectionFooter" >
                        <button className="btn-aboutMePurchase" >
                            <i className="fa-solid fa-cart-shopping"></i>
                            Add to Cart</button>
                        <button className="btn-aboutMePurchase" >
                          <i className="fa-solid fa-heart"></i>Wishlist
                        </button>
                    </div>
                </div>
                 
            </div>
        
        </div>
        <div className="caroselHead">
                <div className="aboutMeratingContainer">
                            {renderStars(items.rating)}
                </div> 
                <br/>
                <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                     
                    <div className="commentContainer">
                     
                      <div>
                        <img className="userCommentImage" src={items.reviews[0].user.avatar}/>
                      </div>
                       <div className="commentUserName">
                      {items.reviews[0].user.username}
                      </div>
                      <div className="commentUserRating" >
                        {items.reviews[0].rating}
                      </div>
                      <div className="commentUserComment">
                        {items.reviews[0].comment}
                        </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                     <div className="commentContainer">{items.reviews[1].user.username}</div>
                  </div>
                  <div className="carousel-item">
                    <div className="commentContainer">{items.reviews[2].user.username}</div>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
        </div>
         
    </div>
    )
}