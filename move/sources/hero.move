module challenge::hero;

use std::string::String;
use sui::tx_context::TxContext;
use sui::object::{Self, UID};
use sui::transfer;
use sui::event;

// ========= STRUCTS =========
public struct Hero has key, store {
    id: UID,
    name: String,
    image_url: String,
    power: u64,
}

public struct HeroMetadata has key, store {
    id: UID,
    timestamp: u64,
}

// ========= FUNCTIONS =========

#[allow(lint(self_transfer))]
public fun create_hero(
    name: String,
    image_url: String,
    power: u64,
    ctx: &mut TxContext
) {
    // ---- Create the Hero object ----
    let hero = Hero {
        id: object::new(ctx),
        name,
        image_url,
        power,
    };

    // ---- Transfer Hero NFT to the sender ----
    transfer::public_transfer(hero, tx_context::sender(ctx));

    // ---- Create metadata ----
    let metadata = HeroMetadata {
        id: object::new(ctx),
        timestamp: ctx.epoch_timestamp_ms(),
    };

    // ---- Freeze metadata (immutability required by tests) ----
    transfer::freeze_object(metadata);
}

// ========= GETTER FUNCTIONS =========

public fun hero_power(hero: &Hero): u64 {
    hero.power
}

#[test_only]
public fun hero_name(hero: &Hero): String {
    hero.name
}

#[test_only]
public fun hero_image_url(hero: &Hero): String {
    hero.image_url
}

#[test_only]
public fun hero_id(hero: &Hero): ID {
    object::id(hero)
}