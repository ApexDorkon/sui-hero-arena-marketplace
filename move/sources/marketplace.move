module challenge::marketplace;

use challenge::hero::Hero;
use sui::coin::{Self, Coin};
use sui::event;
use sui::tx_context::{Self, TxContext};
use sui::transfer;
use sui::object::{Self, UID, ID};
use sui::sui::SUI;

// ========= ERRORS =========

const EInvalidPayment: u64 = 1;

// ========= STRUCTS =========

public struct ListHero has key, store {
    id: UID,
    nft: Hero,
    price: u64,
    seller: address,
}

// ========= CAPABILITIES =========

public struct AdminCap has key, store {
    id: UID,
}

// ========= EVENTS =========

public struct HeroListed has copy, drop {
    list_hero_id: ID,
    price: u64,
    seller: address,
    timestamp: u64,
}

public struct HeroBought has copy, drop {
    list_hero_id: ID,
    price: u64,
    buyer: address,
    seller: address,
    timestamp: u64,
}

// ========= FUNCTIONS =========

fun init(ctx: &mut TxContext) {
    // Create admin capability
    let admin = AdminCap {
        id: object::new(ctx),
    };

    // Transfer it to the module publisher
    transfer::public_transfer(admin, tx_context::sender(ctx));
}

public fun list_hero(nft: Hero, price: u64, ctx: &mut TxContext) {
    let seller = tx_context::sender(ctx);

    let list_hero = ListHero {
        id: object::new(ctx),
        nft,
        price,
        seller,
    };

    // Emit listing event
    event::emit(HeroListed {
        list_hero_id: object::id(&list_hero),
        price,
        seller,
        timestamp: ctx.epoch_timestamp_ms(),
    });

    // Share the listing so anyone can buy
    transfer::share_object(list_hero);
}

#[allow(lint(self_transfer))]
public fun buy_hero(list_hero: ListHero, coin: Coin<SUI>, ctx: &mut TxContext) {
    // Destructure listing
    let ListHero { id, nft, price, seller } = list_hero;

    // Verify correct payment
    assert!(coin::value(&coin) == price, EInvalidPayment);

    let buyer = tx_context::sender(ctx);

    // Transfer the payment to seller
    transfer::public_transfer(coin, seller);

    // Transfer hero NFT to buyer
    transfer::public_transfer(nft, buyer);

    // Emit buy event
    event::emit(HeroBought {
        list_hero_id: object::uid_to_inner(&id),
        price,
        buyer,
        seller,
        timestamp: ctx.epoch_timestamp_ms(),
    });

    // Delete listing object ID
    object::delete(id);
}

// ========= ADMIN FUNCTIONS =========

public fun delist(_: &AdminCap, list_hero: ListHero) {
    let ListHero { id, nft, price: _, seller } = list_hero;

    // Return NFT to seller
    transfer::public_transfer(nft, seller);

    // Delete listing ID
    object::delete(id);
}

public fun change_the_price(_: &AdminCap, list_hero: &mut ListHero, new_price: u64) {
    list_hero.price = new_price;
}

// ========= GETTER FUNCTIONS =========

#[test_only]
public fun listing_price(list_hero: &ListHero): u64 {
    list_hero.price
}

// ========= TEST ONLY FUNCTIONS =========

#[test_only]
public fun test_init(ctx: &mut TxContext) {
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };
    transfer::transfer(admin_cap, ctx.sender());
}