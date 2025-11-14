module challenge::arena;

use challenge::hero::{Hero, hero_power};
use sui::tx_context::{Self, TxContext};
use sui::object::{Self, UID};
use sui::transfer;
use sui::event;

// ========= STRUCTS =========

public struct Arena has key, store {
    id: UID,
    warrior: Hero,
    owner: address,
}

// ========= EVENTS =========

public struct ArenaCreated has copy, drop {
    arena_id: ID,
    timestamp: u64,
}

public struct ArenaCompleted has copy, drop {
    winner_hero_id: ID,
    loser_hero_id: ID,
    timestamp: u64,
}

// ========= FUNCTIONS =========

public fun create_arena(hero: Hero, ctx: &mut TxContext) {
    let arena = Arena {
        id: object::new(ctx),
        warrior: hero,
        owner: tx_context::sender(ctx),
    };

    // Emit event
    event::emit(ArenaCreated {
        arena_id: object::id(&arena),
        timestamp: ctx.epoch_timestamp_ms(),
    });

    // Make arena a shared object
    transfer::share_object(arena);
}

#[allow(lint(self_transfer))]
public fun battle(hero: Hero, arena: Arena, ctx: &mut TxContext) {
    // Destructure arena
    let Arena { id, warrior, owner } = arena;

    let challenger_power = hero_power(&hero);
    let defender_power = hero_power(&warrior);

    let timestamp = ctx.epoch_timestamp_ms();

    // Challenger wins
    if (challenger_power > defender_power) {
        let winner = tx_context::sender(ctx);

        // Emit event inside branch
        event::emit(ArenaCompleted {
            winner_hero_id: object::id(&hero),
            loser_hero_id: object::id(&warrior),
            timestamp,
        });

        // Transfer both heroes to challenger
        transfer::public_transfer(hero, winner);
        transfer::public_transfer(warrior, winner);
    } else {
        // Defender wins
        let winner = owner;

        event::emit(ArenaCompleted {
            winner_hero_id: object::id(&warrior),
            loser_hero_id: object::id(&hero),
            timestamp,
        });

        // Transfer both heroes to arena owner
        transfer::public_transfer(hero, winner);
        transfer::public_transfer(warrior, winner);
    };

    // Delete arena ID
    object::delete(id);
}