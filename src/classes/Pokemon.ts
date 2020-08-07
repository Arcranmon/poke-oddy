import { store } from '@/store';
import { PokemonRaw, RoleRaw, TraitRaw, Skills } from '@/class';

class Pokemon {
  private _species: string;
  private _nickname: string;
  private _id: string;

  private _level: number;
  private _role: string; //Maybe replace with like PokemonRole later
  private _ability: string; //Maybe replace with like PokemonRole later

  private _moves: Array<string>; //Maybe replace with like PokemonRole later

  private _maxSkillPoints: number;
  private _skills: Skills;

  private _monRaw: PokemonRaw;
  private _roleRaw: RoleRaw;
  private _traitsRaw: Array<TraitRaw>;

  public constructor() {
    this._species = '';
    this._nickname = '';
    this._id = '';
    this._level = 1;
    this._role = '';
    this._ability = '';
    this._moves = [];
    this._maxSkillPoints = 2;
    this._skills = new Skills();
    this._monRaw = new PokemonRaw();
    this._traitsRaw = [];
  }

  public get Raw() {
    return this._monRaw;
  }

  public get ID() {
    return this._id;
  }

  public set ID(id: string) {
    this._id = id;
  }

  public set Raw(newVal: PokemonRaw) {
    this.constructor();
    this._monRaw = newVal;
    this._species = newVal.name;
    this._moves = [
      this._monRaw.smove1,
      this._monRaw.smove2,
      this._monRaw.smove3,
    ];

    this._skills.DeficientSkill = this._monRaw.badskill;
  }

  public get HasSpecies(): boolean {
    return this._species.length > 0;
  }
  public get Species(): string {
    return this._species;
  }

  // ABILITY FUNCTIONS
  public get HasAbility(): boolean {
    return this._ability.length > 0;
  }
  public get AbilityList(): Array<String> {
    if (this._monRaw.ability2) {
      return [this._monRaw.ability1, this._monRaw.ability2];
    } else {
      return [this._monRaw.ability1];
    }
  }

  public get Ability(): string {
    return this._ability;
  }
  public set Ability(newAbility: string) {
    this._ability = newAbility;
  }

  // ROLE FUNCTIONS
  public get HasRole(): boolean {
    return this._role.length > 0;
  }
  public get RoleList(): Array<String> {
    return [this._monRaw.role1, this._monRaw.role2, this._monRaw.role3];
  }
  public set Role(newRole: RoleRaw) {
    this._role = newRole.name;
    this._roleRaw = newRole;
  }
  public get RoleName(): string {
    return this._role;
  }

  // MOVE FUNCTIONS
  public get MoveList(): Array<string> {
    return this._moves;
  }
  public get HasStartingMove(): boolean {
    return this._moves.length > 3;
  }
  public get Tier1NaturalMoveList(): Array<string> {
    return [
      this._monRaw.t1natmove1,
      this._monRaw.t1natmove2,
      this._monRaw.t1natmove3,
    ];
  }
  public get Tier1TutorMoveList(): Array<string> {
    var tutMoves = [];

    if (this._monRaw.t1tutmove1) {
      tutMoves.push(this._monRaw.t1tutmove1);
    }
    if (this._monRaw.t1tutmove2) {
      tutMoves.push(this._monRaw.t1tutmove2);
    }
    if (this._monRaw.t1tutmove3) {
      tutMoves.push(this._monRaw.t1tutmove3);
    }

    return tutMoves;
  }
  public get StartingMoves(): Array<string> {
    return [this._monRaw.smove1, this._monRaw.smove2, this._monRaw.smove3];
  }
  public AddMove(newMove: string) {
    if (!this._moves.includes(newMove)) {
      this._moves.push(newMove);
    }
  }
  public RemoveMove(newMove: string) {
    for (let ii in this._moves) {
      if (this._moves[ii] == newMove) {
        this.MoveList.splice(Number(ii), 1);
        return;
      }
    }
  }
  public ValidMoveNumber(): boolean {
    if (this.MoveList.length > 0 && this.MoveList.length <= 6) {
      return true;
    }
    return false;
  }
  public ValidTutorMoves(): boolean {
    var numTut = 0;
    for (var move of this.Tier1TutorMoveList) {
      if (!this._moves.includes(move)) {
        numTut += 1;
      }
    }

    return numTut <= 2;
  }
  public MovesValid(): boolean {
    return this.ValidMoveNumber() && this.ValidTutorMoves();
  }

  public MovesErrorMessage(): string {
    if (!this.ValidMoveNumber()) {
      return 'Invalid number of moves; maximum is 6, minimum is 1.';
    }
    if (!this.ValidTutorMoves()) {
      return 'Too many tutor moves known; maximum is 2.';
    }
    return '\n';
  }
  public SetMoves(newMoves: string[]) {
    this._moves = newMoves;
  }
  public UnknownNaturalMoves(): string[] {
    var moveContainer = [];
    for (var move of this.StartingMoves) {
      if (!this._moves.includes(move)) {
        moveContainer.push(move);
      }
    }
    for (var move of this.Tier1NaturalMoveList) {
      if (!this._moves.includes(move)) {
        moveContainer.push(move);
      }
    }

    return moveContainer;
  }
  public UnknownTutorMoves(): string[] {
    var moveContainer = [];
    for (var move of this.Tier1TutorMoveList) {
      if (!this._moves.includes(move)) {
        moveContainer.push(move);
      }
    }

    return moveContainer;
  }
  public MaxMoves(): number {
    return 6;
  }
  public PopMove() {
    this._moves.pop();
  }

  public BasicAttackList(): string[] {
    var baList = [];
    var move = '';
    if (this._monRaw.basicattack1) {
      if (this._monRaw.basicattack1.includes('Melee')) {
        move = 'Melee Basic Attack';
      } else {
        move = 'Ranged Basic Attack';
      }
      if (this._monRaw.basicattack1.includes('Innate')) {
        baList.push(move);
      }
      baList.push(move);
    }
    if (this._monRaw.basicattack2) {
      if (this._monRaw.basicattack2.includes('Melee')) {
        move = 'Melee Basic Attack';
      } else {
        move = 'Ranged Basic Attack';
      }
      if (this._monRaw.basicattack2.includes('Innate')) {
        baList.push(move);
      }
      baList.push(move);
    }
    return baList;
  }

  public BasicAttackTypes(): string[] {
    var baList = [];
    if (this._monRaw.basicattack1) {
      if (this._monRaw.basicattack1.includes('Innate')) {
        baList.push('Normal');
        baList.push(this._monRaw.type1);
      } else {
        baList.push(
          this._monRaw.basicattack1.substring(
            this._monRaw.basicattack1.indexOf(' ') + 1,
            this._monRaw.basicattack1.lastIndexOf(' ')
          )
        );
      }
    }
    if (this._monRaw.basicattack2) {
      if (this._monRaw.basicattack2.includes('Innate')) {
        baList.push('Normal');
        baList.push(this._monRaw.type1);
      } else {
        baList.push(
          this._monRaw.basicattack2.substring(
            this._monRaw.basicattack2.indexOf(' ') + 1,
            this._monRaw.basicattack2.lastIndexOf(' ')
          )
        );
      }
    }
    return baList;
  }

  public BasicAttackDamage(): string[] {
    var baList = [];
    var move = '';
    if (this._monRaw.basicattack1) {
      if (this._monRaw.basicattack1.includes('Physical')) {
        move = 'Physical';
      } else {
        move = 'Special';
      }
      if (this._monRaw.basicattack1.includes('Innate')) {
        baList.push(move);
      }
      baList.push(move);
    }
    if (this._monRaw.basicattack2) {
      if (this._monRaw.basicattack2.includes('Physical')) {
        move = 'Physical';
      } else {
        move = 'Special';
      }
      if (this._monRaw.basicattack2.includes('Innate')) {
        baList.push(move);
      }
      baList.push(move);
    }
    return baList;
  }

  // SKILL FUNCTIONS
  public get Skills() {
    return this._skills;
  }
  public set Skills(new_skills: Skills) {
    this._skills = new_skills;
  }

  public get Force(): number {
    return this._skills.Force;
  }
  public get Traversal(): number {
    return this._skills.Traversal;
  }
  public get Survival(): number {
    return this._skills.Survival;
  }
  public get Finesse(): number {
    return this._skills.Finesse;
  }
  public get Focus(): number {
    return this._skills.Focus;
  }
  public get Covertness(): number {
    return this._skills.Covertness;
  }
  public get Presence(): number {
    return this._skills.Presence;
  }
  public get Insight(): number {
    return this._skills.Insight;
  }
  public get Sway(): number {
    return this._skills.Sway;
  }
  public get SkillPoints(): number {
    return this._maxSkillPoints - this._skills.TotalPoints;
  }
  public get HasNoSkillPoints(): boolean {
    return this.SkillPoints == 0;
  }
  public get FavoredSkillPoints(): number {
    return (
      this._skills[this._monRaw.skill1] + this._skills[this._monRaw.skill2]
    );
  }
  public get Favored1(): string {
    return this._monRaw.skill1;
  }
  public get Favored2(): string {
    return this._monRaw.skill2;
  }
  public get Deficient(): string {
    return this._monRaw.badskill;
  }
  public IsFavored(skillName: string): boolean {
    if (skillName == this.Favored1 || skillName == this.Favored2) {
      return true;
    }
    return false;
  }
  public IsDeficient(skillName: string): boolean {
    if (skillName == this.Deficient) {
      return true;
    }
    return false;
  }

  // UTILITY TO RETURN RAW DATA
  public get DexNumber(): string {
    return this._monRaw.dexnumber;
  }
  public get NumTypes(): number {
    if (this._monRaw.type2) {
      return 2;
    }
    return 1;
  }
  public get Type1(): string {
    return this._monRaw.type1;
  }
  public get Type2(): string {
    return this._monRaw.type2;
  }
  public get Size(): string {
    return this._monRaw.size;
  }
  public get Level(): number {
    return this._level;
  }
  public get Tier(): number {
    return 1;
  }
  public get TurfList(): Array<String> {
    if (this._monRaw.turf2) {
      return [this._monRaw.turf1, this._monRaw.turf2];
    } else {
      return [this._monRaw.turf1];
    }
  }
  public get GiftList(): Array<String> {
    if (this._monRaw.gift2) {
      return [this._monRaw.gift1, this._monRaw.gift2];
    } else {
      return [this._monRaw.gift1];
    }
  }
  public get TraitList(): Array<String> {
    if (this._monRaw.trait2) {
      return [this._monRaw.trait1, this._monRaw.trait2];
    } else {
      return [this._monRaw.trait1];
    }
  }

  // NAMING UTILITY
  public set Nickname(name: string) {
    this._nickname = name;
  }
  public get Nickname() {
    return this._nickname;
  }

  public get Summary(): string {
    return 'Level ' + String(this._level) + ' ' + this._species;
  }

  // COMBAT STATS
  public get MaxHP(): number {
    if (this._roleRaw.hp == 'Low') {
      return Number(35) + Number(3 * Math.floor(this._level / 2));
    }
    if (this._roleRaw.hp == 'Medium') {
      return Number(40) + Number(4 * Math.floor(this._level / 2));
    }
    if (this._roleRaw.hp == 'High') {
      return Number(45) + Number(5 * Math.floor(this._level / 2));
    }
  }
  public get Init(): number {
    return Number(this._monRaw.initiative) + Number(this._roleRaw.init);
  }
  public get Movement(): string {
    if (this._monRaw.movementtype1) {
      return this._monRaw.movement + ' ' + this._monRaw.movementtype1;
    } else {
      return String(this._monRaw.movement);
    }
  }
  public DefenseStat(stat: string): number {
    if (this._monRaw.def1 == stat) {
      return this._roleRaw.def1;
    }
    if (this._monRaw.def2 == stat) {
      return this._roleRaw.def2;
    }
    return this._roleRaw.def3;
  }

  public PhysicalDamage(): number {
    var phys = 0;
    for (var tr of this._traitsRaw) {
      if (tr.physical && tr.damage) {
        phys += tr.value; // Add increment later
      }
    }
    return phys;
  }

  public SpecialDamage(): number {
    var spec = 0;
    for (var tr of this._traitsRaw) {
      if (tr.special && tr.damage) {
        spec += tr.value; // Add increment later
      }
    }
    return spec;
  }

  public PhysicalArmor(): number {
    var phys = 0;
    for (var tr of this._traitsRaw) {
      if (tr.physical && tr.armor) {
        phys += tr.value; // Add increment later
      }
    }
    return phys;
  }

  public SpecialArmor(): number {
    var spec = 0;
    for (var tr of this._traitsRaw) {
      if (tr.special && tr.armor) {
        spec += tr.value; // Add increment later
      }
    }
    return spec;
  }

  public MeleeDamageDie(): number {
    if (this._roleRaw.ability1 == 'Melee Attacker') {
      return 10;
    } else if (this._roleRaw.ability1 == 'Versatile Attacker') {
      return 8;
    }
    return 6;
  }

  public RangedDamageDie(): number {
    if (this._roleRaw.ability1 == 'Ranged Attacker') {
      return 8;
    } else if (this._roleRaw.ability1 == 'Versatile Attacker') {
      return 8;
    }
    return 6;
  }

  // TRAIT UTILTY
  public AddTrait(newVal: TraitRaw) {
    this._traitsRaw.push(newVal);
  }
}

export default Pokemon;
