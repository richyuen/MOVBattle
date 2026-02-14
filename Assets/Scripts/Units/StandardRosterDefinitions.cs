using System.Collections.Generic;

namespace MOVBattle.Units
{
    public static class StandardRosterDefinitions
    {
        public static IReadOnlyList<UnitDefinition> Create()
        {
            return new List<UnitDefinition>
            {
                // Tribal
                Unit("tribal.clubber", "Clubber", FactionId.Tribal, 70, 95f, 0.9f, 4.2f, 1.6f, 0.42f, "melee.light", "ai.rush", "ragdoll.light"),
                Unit("tribal.protector", "Protector", FactionId.Tribal, 90, 120f, 1.1f, 3.8f, 1.7f, 0.46f, "melee.light", "ai.brace", "ragdoll.medium"),
                Unit("tribal.spear_thrower", "Spear Thrower", FactionId.Tribal, 140, 95f, 0.9f, 3.9f, 10.0f, 0.42f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("tribal.stoner", "Stoner", FactionId.Tribal, 160, 120f, 1.2f, 3.6f, 11.5f, 0.5f, "throw.explosive", "ai.ranged", "ragdoll.medium"),
                Unit("tribal.bone_mage", "Bone Mage", FactionId.Tribal, 220, 150f, 1.2f, 3.3f, 8.0f, 0.52f, "melee.heavy", "ai.rush", "ragdoll.medium"),
                Unit("tribal.chieftain", "Chieftain", FactionId.Tribal, 400, 420f, 1.9f, 4.4f, 2.2f, 0.62f, "melee.heavy", "ai.boss", "ragdoll.heavy"),
                Unit("tribal.mammoth", "Mammoth", FactionId.Tribal, 1200, 1600f, 5.2f, 3.0f, 2.4f, 1.15f, "boss.legendary", "ai.boss", "ragdoll.boss"),

                // Farmer
                Unit("farmer.halfling", "Halfling", FactionId.Farmer, 65, 70f, 0.6f, 4.5f, 1.4f, 0.35f, "melee.light", "ai.rush", "ragdoll.light"),
                Unit("farmer.farmer", "Farmer", FactionId.Farmer, 80, 95f, 0.9f, 4.0f, 1.8f, 0.42f, "melee.light", "ai.rush", "ragdoll.light"),
                Unit("farmer.hay_baler", "Hay Baler", FactionId.Farmer, 110, 145f, 1.3f, 3.4f, 1.8f, 0.5f, "melee.medium", "ai.brace", "ragdoll.medium"),
                Unit("farmer.potion_seller", "Potion Seller", FactionId.Farmer, 180, 115f, 1.0f, 3.4f, 9.0f, 0.42f, "throw.explosive", "ai.ranged", "ragdoll.light"),
                Unit("farmer.harvester", "Harvester", FactionId.Farmer, 260, 240f, 1.6f, 3.8f, 2.0f, 0.56f, "melee.heavy", "ai.rush", "ragdoll.medium"),
                Unit("farmer.wheelbarrow", "Wheelbarrow", FactionId.Farmer, 520, 480f, 2.4f, 5.0f, 2.0f, 0.72f, "melee.heavy", "ai.rush", "ragdoll.heavy"),
                Unit("farmer.scarecrow", "Scarecrow", FactionId.Farmer, 1000, 540f, 1.7f, 3.3f, 13.0f, 0.66f, "ranged.heavy", "ai.ranged", "ragdoll.heavy"),

                // Medieval
                Unit("medieval.bard", "Bard", FactionId.Medieval, 65, 70f, 0.7f, 4.8f, 1.2f, 0.36f, "melee.light", "ai.rush", "ragdoll.light"),
                Unit("medieval.squire", "Squire", FactionId.Medieval, 100, 125f, 1.0f, 4.0f, 1.8f, 0.46f, "melee.medium", "ai.rush", "ragdoll.medium"),
                Unit("medieval.archer", "Archer", FactionId.Medieval, 140, 95f, 0.8f, 3.7f, 12.0f, 0.42f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("medieval.healer", "Healer", FactionId.Medieval, 180, 100f, 0.9f, 3.6f, 8.0f, 0.4f, "support.heal", "ai.support", "ragdoll.light"),
                Unit("medieval.knight", "Knight", FactionId.Medieval, 320, 320f, 1.8f, 3.9f, 2.1f, 0.58f, "melee.heavy", "ai.brace", "ragdoll.heavy"),
                Unit("medieval.catapult", "Catapult", FactionId.Medieval, 1000, 380f, 3.1f, 2.2f, 18.0f, 0.8f, "siege.catapult", "ai.ranged", "ragdoll.heavy"),
                Unit("medieval.king", "King", FactionId.Medieval, 1200, 900f, 2.3f, 4.2f, 2.3f, 0.72f, "boss.legendary", "ai.boss", "ragdoll.boss"),

                // Ancient
                Unit("ancient.shield_bearer", "Shield Bearer", FactionId.Ancient, 80, 135f, 1.1f, 3.8f, 1.7f, 0.5f, "melee.light", "ai.brace", "ragdoll.medium"),
                Unit("ancient.sarissa", "Sarissa", FactionId.Ancient, 100, 120f, 1.1f, 3.6f, 2.6f, 0.48f, "melee.medium", "ai.brace", "ragdoll.medium"),
                Unit("ancient.hoplite", "Hoplite", FactionId.Ancient, 140, 185f, 1.4f, 3.8f, 2.0f, 0.54f, "melee.medium", "ai.brace", "ragdoll.medium"),
                Unit("ancient.ballista", "Ballista", FactionId.Ancient, 900, 300f, 2.4f, 2.4f, 17.0f, 0.78f, "ranged.heavy", "ai.ranged", "ragdoll.heavy"),
                Unit("ancient.snake_archer", "Snake Archer", FactionId.Ancient, 220, 105f, 0.9f, 3.7f, 11.5f, 0.42f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("ancient.minotaur", "Minotaur", FactionId.Ancient, 700, 780f, 2.7f, 4.3f, 2.4f, 0.84f, "melee.heavy", "ai.boss", "ragdoll.heavy"),
                Unit("ancient.zeus", "Zeus", FactionId.Ancient, 2000, 1200f, 2.2f, 3.7f, 13.0f, 0.76f, "boss.legendary", "ai.boss", "ragdoll.boss"),

                // Viking
                Unit("viking.headbutter", "Headbutter", FactionId.Viking, 90, 125f, 1.0f, 4.1f, 1.6f, 0.46f, "melee.medium", "ai.rush", "ragdoll.medium"),
                Unit("viking.ice_archer", "Ice Archer", FactionId.Viking, 160, 100f, 0.9f, 3.6f, 12.0f, 0.42f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("viking.brawler", "Brawler", FactionId.Viking, 140, 170f, 1.3f, 4.0f, 1.9f, 0.5f, "melee.medium", "ai.rush", "ragdoll.medium"),
                Unit("viking.berserker", "Berserker", FactionId.Viking, 220, 220f, 1.2f, 5.0f, 1.7f, 0.52f, "melee.heavy", "ai.rush", "ragdoll.medium"),
                Unit("viking.valkyrie", "Valkyrie", FactionId.Viking, 420, 300f, 1.4f, 4.8f, 2.0f, 0.56f, "melee.heavy", "ai.rush", "ragdoll.heavy"),
                Unit("viking.longship", "Longship", FactionId.Viking, 500, 520f, 2.8f, 3.3f, 2.3f, 0.92f, "melee.heavy", "ai.brace", "ragdoll.heavy"),
                Unit("viking.jarl", "Jarl", FactionId.Viking, 1200, 920f, 2.4f, 4.1f, 2.3f, 0.74f, "boss.legendary", "ai.boss", "ragdoll.boss"),

                // Dynasty
                Unit("dynasty.samurai", "Samurai", FactionId.Dynasty, 140, 180f, 1.2f, 4.1f, 2.0f, 0.5f, "melee.medium", "ai.brace", "ragdoll.medium"),
                Unit("dynasty.firework_archer", "Firework Archer", FactionId.Dynasty, 180, 100f, 0.9f, 3.7f, 12.5f, 0.42f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("dynasty.monk", "Monk", FactionId.Dynasty, 220, 240f, 1.2f, 4.6f, 1.9f, 0.5f, "melee.heavy", "ai.rush", "ragdoll.medium"),
                Unit("dynasty.ninja", "Ninja", FactionId.Dynasty, 160, 90f, 0.8f, 4.9f, 10.0f, 0.4f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("dynasty.dragon", "Dragon", FactionId.Dynasty, 1000, 500f, 2.0f, 3.9f, 11.0f, 0.75f, "throw.explosive", "ai.ranged", "ragdoll.heavy"),
                Unit("dynasty.hwacha", "Hwacha", FactionId.Dynasty, 900, 320f, 2.8f, 2.4f, 16.0f, 0.8f, "ranged.heavy", "ai.ranged", "ragdoll.heavy"),
                Unit("dynasty.monkey_king", "Monkey King", FactionId.Dynasty, 2000, 1500f, 2.3f, 4.3f, 2.4f, 0.8f, "boss.legendary", "ai.boss", "ragdoll.boss"),

                // Renaissance
                Unit("renaissance.painter", "Painter", FactionId.Renaissance, 80, 95f, 0.9f, 3.9f, 1.7f, 0.44f, "melee.light", "ai.rush", "ragdoll.light"),
                Unit("renaissance.fencer", "Fencer", FactionId.Renaissance, 160, 150f, 1.0f, 4.5f, 2.0f, 0.46f, "melee.medium", "ai.rush", "ragdoll.medium"),
                Unit("renaissance.balloon_archer", "Balloon Archer", FactionId.Renaissance, 180, 95f, 0.8f, 3.8f, 11.5f, 0.42f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("renaissance.musketeer", "Musketeer", FactionId.Renaissance, 220, 110f, 1.0f, 3.5f, 12.5f, 0.46f, "ranged.heavy", "ai.ranged", "ragdoll.light"),
                Unit("renaissance.halberd", "Halberd", FactionId.Renaissance, 200, 230f, 1.4f, 3.7f, 2.3f, 0.54f, "melee.heavy", "ai.brace", "ragdoll.medium"),
                Unit("renaissance.jouster", "Jouster", FactionId.Renaissance, 500, 460f, 2.2f, 4.7f, 2.4f, 0.74f, "melee.heavy", "ai.rush", "ragdoll.heavy"),
                Unit("renaissance.da_vinci_tank", "Da Vinci Tank", FactionId.Renaissance, 1800, 1100f, 3.5f, 2.7f, 14.0f, 1.05f, "siege.catapult", "ai.ranged", "ragdoll.boss"),

                // Pirate
                Unit("pirate.flintlock", "Flintlock", FactionId.Pirate, 120, 95f, 0.9f, 3.9f, 10.0f, 0.42f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("pirate.blunderbuss", "Blunderbuss", FactionId.Pirate, 160, 110f, 1.0f, 3.5f, 7.0f, 0.45f, "ranged.heavy", "ai.ranged", "ragdoll.light"),
                Unit("pirate.bomb_thrower", "Bomb Thrower", FactionId.Pirate, 220, 110f, 1.0f, 3.5f, 10.0f, 0.45f, "throw.explosive", "ai.ranged", "ragdoll.light"),
                Unit("pirate.harpooner", "Harpooner", FactionId.Pirate, 140, 125f, 1.0f, 3.8f, 10.5f, 0.44f, "ranged.light", "ai.ranged", "ragdoll.light"),
                Unit("pirate.captain", "Captain", FactionId.Pirate, 500, 520f, 2.0f, 4.0f, 2.3f, 0.7f, "melee.heavy", "ai.boss", "ragdoll.heavy"),
                Unit("pirate.cannon", "Cannon", FactionId.Pirate, 1000, 340f, 3.0f, 2.3f, 16.0f, 0.86f, "siege.catapult", "ai.ranged", "ragdoll.heavy"),
                Unit("pirate.pirate_queen", "Pirate Queen", FactionId.Pirate, 2500, 1700f, 2.7f, 4.4f, 2.5f, 0.85f, "boss.legendary", "ai.boss", "ragdoll.boss")
            };
        }

        private static UnitDefinition Unit(
            string id,
            string name,
            FactionId faction,
            int cost,
            float maxHealth,
            float mass,
            float moveSpeed,
            float engageRange,
            float collisionRadius,
            string attackProfileId,
            string aiProfileId,
            string ragdollProfileId)
        {
            return new UnitDefinition
            {
                Id = id,
                DisplayName = name,
                Faction = faction,
                Cost = cost,
                MaxHealth = maxHealth,
                Mass = mass,
                MoveSpeed = moveSpeed,
                EngageRange = engageRange,
                CollisionRadius = collisionRadius,
                AttackProfileId = attackProfileId,
                AIProfileId = aiProfileId,
                RagdollProfileId = ragdollProfileId
            };
        }
    }
}
