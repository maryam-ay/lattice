// ===================================================================
//  LATTICE — a 3D word puzzle adrift in deep space
//  Plain JS + Three.js.  Find words along the rows of a 4x4x4 grid of
//  glowing letter cubes; clear them, let gravity collapse the lattice,
//  and try to dissolve the whole structure.
// ===================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// -------------------------------------------------------------------
//  WORD LIST
//  A compact, bundled list of common 3-6 letter English words. Heavy
//  on 3 and 4 letter words because every grid line is only 4 cubes
//  long. Built into a Set for O(1) lookups. The regex guard means any
//  stray token is silently ignored rather than corrupting the set.
// -------------------------------------------------------------------
const WORD_SOURCE = `
ace act add ado age ago aid ail aim air ale all amp and ant any ape apt arc are ark
arm art ash ask asp ate awe axe aye bad bag ban bar bat bay bed bee beg bet bid big
bin bit boa bob bog boo bow box boy bra bud bug bun bus but buy cab cad cam can cap
car cat cob cod cog con coo cop cot cow coy cry cub cue cup cur cut dab dad dam day
den dew did die dig dim din dip doe dog don dot dry dub due dug duo dye ear eat ebb
eel egg ego elf elk elm emu end era erg eve ewe eye fad fan far fat fax fed fee fen
few fib fig fin fir fit fix flu fly foe fog for fox fro fry fun fur gab gag gal gap
gas gel gem get gig gin god goo got gum gun gut guy gym had hag ham has hat hay hem
hen her hew hex hey hid him hip his hit hoe hog hop hot how hub hue hug hum hut ice
icy ill imp ink inn ion ire irk its ivy jab jag jam jar jaw jay jet jig job jog jot
joy jug jut keg key kid kin kit lab lad lag lap law lax lay led leg let lid lie lip
lit lob log lop lot low lug lye mad man map mar mat maw may men met mid mix mob mod
mom mop mud mug mum nab nag nap nay net new nil nip nit nod nor not now nub nut oaf
oak oar oat odd ode off oft ohm oil old one opt orb ore our out owe owl own pad pal
pan par pat paw pay pea peg pen pet pew pie pig pin pit ply pod pop pot pro pry pub
pug pun pup pus put rad rag ram ran rap rat raw ray red ref rep rev rib rid rig rim
rip rob rod roe rot row rub rue rug rum run rut rye sad sag sap sat saw say sea see
set sew she shy sin sip sir sit six ski sky sly sob sod son sop sot sow soy spa spy
sty sub sue sum sun sup tab tad tag tan tap tar tat tax tea ten the thy tic tie til
tin tip tit toe tog tom ton too top tot tow toy try tub tug tun tut two ugh urn use
van vat vet vex via vie vim vow wad wag wan war was wax way web wed wee wet who why
wig win wit woe wok won woo wow wry yak yam yap yaw yea yen yes yet yew yin yip you
zag zap zed zee zig zip zit zoo
able acid aces acre afar aged ages aide ails aims airs ajar akin alas ales ally aloe
also alto amid amok amps anew ante anti ants apex apse aqua arch arcs area ares aria
arid arms army arts ashy atom atop aunt aura auto avid away awed awes axes axis axle
babe baby back bade bags bail bait bake bald bale ball balm band bane bang bank bans
barb bard bare barn bars base bash bask bass bath bats bays bead beak beam bean bear
beat beds beef been beep beer bees begs bell belt bend bent best bets bias bids bike
bile bill bind bird bite bits blob blot blow blue blur boar boat body bogs boil bold
bolt bomb bond bone bony book boom boon boot bore born boss both bout bowl bows boys
brag bran bras bred brew brim brow buck buds buff bugs bulb bulk bull bump bums bunk
buns bunt buoy burn burr burs bury bush bust busy butt buys buzz cabs cafe cage cake
calf call calm came camp cane cans cape caps card care carp cars cart case cash cask
cast cats cave cell cent chap char chat chef chew chin chip chop chum cite city clad
clam clan clap claw clay clip clod clog clot club clue coal coat coax cobs code coil
coin cola cold colt coma comb come cone cons cook cool coop cope copy cord core cork
corn cost cots cove cows cozy crab crag cram crew crib crop crow cube cubs cued cues
cuff cult cure curl curs curt cusp cute cuts dabs dads daft dais dale dame damp dams
dare dark darn dart dash data date dawn days daze dead deaf deal dean dear debt deck
deed deem deep deer dell demo dens dent deny desk dial dice died dies diet digs dime
dine ding dins dint dire dirt disc dish disk diva dive dock docs does doff dogs dole
doll dolt dome done dons doom door dope dorm dose dote dots dove down doze drab drag
dram draw drew drip drop drub drug drum dual duck duct dude duds duel dues duet duke
dull duly dumb dump dune dung dunk duos dupe dusk dust duty dyed dyes each earl earn
ears ease east easy eats eave ebbs echo eddy edge edit eels eery eggs egos elks ells
elms else emit ends envy epic eras ergo errs euro even ever eves evil ewes exam exit
eyed eyes face fact fade fail fair fake fall fame fang fans fare farm fast fate fats
fawn fear feat feed feel fees feet fell felt fend fern feud fief fife figs file fill
film find fine fins fire firm firs fish fist fits five fizz flag flak flap flat flaw
flax flea fled flee flew flex flip flit floe flog flop flow flue flux foal foam foes
fold folk fond font food fool foot ford fore fork form fort foul four fowl foxy frat
fray free fret frog from fuel full fume fund funk furl furs fury fuse fuss fuzz gags
gain gait gala gale gall game gang gape gaps garb gash gasp gate gave gawk gaze gear
geek gels gems gene gent germ gets gift gild gill gilt gins gird girl gist give glad
glee glen glib glob glow glue glum gnat gnaw goad goal goat gobs gods goes gold golf
gone gong good goof gore gory gosh gout gown grab gram gray grew grey grid grim grin
grip grit grow grub gulf gull gulp gums gunk guns guru gush gust guts guys gyms hack
hags hail hair hale half hall halo halt hams hand hang hard hare hark harm harp hart
hash hasp hate hats haul have hawk hays haze hazy head heal heap hear heat heed heel
heft heir held hell helm help hemp hens herb herd here hero hers hewn hick hide high
hike hill hilt hind hint hire hiss hits hive hoax hobo hock hoes hogs hold hole holy
home hone honk hood hoof hook hoop hoot hope hops horn hose host hour hove howl hubs
hued hues huff huge hugs hula hulk hull hump hums hung hunk hunt hurl hurt hush husk
huts hymn iced ices icon idea idle idly idol iffy ills imps inch info inks inky inns
into ions iota ired ires iris irks iron isle itch item jabs jack jade jail jamb jams
jars jaws jays jazz jean jeep jeer jell jerk jest jets jibe jibs jigs jilt jinx jive
jobs jock jogs join joke jolt josh jots joys judo jugs juke jump junk jury just jute
keel keen keep kegs kelp kept keys kick kids kill kiln kilo kilt kind king kink kiss
kite kits kiwi knee knew knit knob knot know labs lace lack lacy lade lads lady laid
lain lair lake lamb lame lamp land lane laps lard lark lash lass last late lath lava
lawn laws lays laze lazy lead leaf leak lean leap leek leer left legs lend lens lent
less lest lets levy liar lice lick lids lied lief lien lies life lift like lilt lily
limb lime limo limp line link lint lion lips lisp list live load loaf loam loan lobe
lobs lock loft logo logs loin lone long look loom loon loop loot lord lore lorn lose
loss lost lots loud love lows luck lull lump lung lure lurk lush lust lute lyes lynx
mace made maid mail maim main make male mall malt mama mane mans many maps mare mark
mars mart mash mask mass mast mate math mats maul maws maze mead meal mean meat meek
meet meld melt memo mend menu meow mere mesh mess mews mica mice mild mile milk mill
mils mime mind mine mini mink mint mire miss mist mite mitt moan moat mobs mock mode
mold mole molt moms monk mood moon moor moot mope more morn moss most mote moth move
mown mows much muck muds muff mugs mule mull mums murk muse mush musk must mute mutt
myna myth nabs nags nail name nape naps nary navy nays neap near neat neck need neon
nest nets news newt next nibs nice nick nigh nine nips nits node nods none nook noon
nope norm nose nosh nosy note noun nous nova nubs nude nuke null numb nuns nuts oaks
oars oath oats obey oboe odds odes odor offs ogle ogre oils oily oink okay okra omen
omit once ones only onto onus onyx ooze opal open opts opus oral orbs ores orgy ouch
ours oust outs oval oven over ovum owed owes owls owns oxen pace pack pact pads page
paid pail pain pair pale pall palm pals pane pang pans pant papa pard pare park pars
part pass past pate path pats pave pawn paws pays peak peal pear peas peat peck peek
peel peer pees pegs pelt pend pens pent peon pere perk perm pert peso pest pets pews
pica pick pier pies pigs pike pile pill pimp pine ping pink pins pint piny pipe pips
pita pith pits pity plan play plea pled plod plop plot plow ploy plug plum plus pock
pods poem poet poke pole poll polo pomp pond pone pong pony pooh pool poor pope pops
pore pork porn port pose posh post posy pots pour pout pram pray prep prey prig prim
prod prof prom prop pros prow pubs puck puff pugs puke pull pulp puma pump punk puns
punt puny pupa pups pure purr push puts putt pyre quad quay quid quip quit quiz race
rack racy raft rage rags raid rail rain rake ramp rams rang rank rant rape raps rapt
rare rash rasp rate rats rave raze razz read real ream reap rear reds reed reef reek
reel refs rein rely rend rent reps rest rhea ribs rice rich rick ride rids rife riff
rift rigs rile rill rims rind ring rink riot ripe rips rise risk rite road roam roan
roar robe robs rock rode rods roes roil role roll romp rood roof rook room root rope
ropy rose rosy rote rots rout rove rows rube rubs ruby rude rued rues ruff rugs ruin
rule rump rune rung runs runt ruse rush rust ruts sack sacs safe saga sage sago sags
said sail sake sale salt same sand sane sang sank saps sari sash sass sate save sawn
saws says scab scam scan scar scat scot scow scud scum seal seam sear seas seat sect
seed seek seem seen seep seer sees self sell semi send sent sera sere serf sets sewn
sews shag shah sham shed shew shim shin ship shod shoe shoo shop shot show shun shut
sick side sift sigh sign silk sill silo silt sing sink sins sire sirs site sits size
skew skid skim skin skip skit slab slag slam slap slat slaw slay sled slew slid slim
slip slit slob sloe slog slop slot slow slug slum slur slut smog smug smut snag snap
snit snob snot snow snub snug soak soap soar sobs sock soda sofa soft soil sold sole
solo sols some song sons soon soot sops sore sort sots souk soul soup sour sown sows
soya span spar spas spat spay sped spew spin spit spot spry spud spun spur stab stag
star stay stem step stew stir stop stow stub stud stun stye subs such suck suds sued
suer sues suit sulk sumo sump sums sung sunk suns sups sure surf swab swag swam swan
swap swat sway swig swim swum sync tabs tack taco tact tads tags tail take tale talk
tall tame tamp tang tank tans tape taps tare tarn taro tarp tars tart task taut taxi
teak teal team tear teas teat tech teed teem teen tees tell temp tend tens tent term
tern test text than that thaw thee them then they thin this thou thud thug thus tick
tide tidy tied tier ties tiff tile till tilt time tine ting tins tint tiny tips tire
toad toed toes tofu toga togs toil told toll tomb tome toms tone tong tons took tool
toot tops tore torn tort toss tote tots tour tout town tows toys tram trap tray tree
trek trim trio trip trod trot troy true tsar tuba tube tubs tuck tuft tugs tuna tune
tuns turf turn tusk tutu twig twin twit type typo tyre ugly ulna umps undo unit unto
upon urea urge urns used user uses vain vale vamp vane vans vary vase vast vats veal
veer veil vein vend vent verb very vest veto vets vial vibe vice vied vies view vile
vine vino viol visa vise void vole volt vote vows wade wadi wads waft wage wags waif
wail wait wake wale walk wall wand wane want ward ware warm warn warp wars wart wary
wash wasp watt wave wavy waxy ways weak weal wean wear webs weds weed week weep weft
weir weld well welt wend went wept were west wets what when whet whew whey whim whip
whir whit whiz whoa whom whop wick wide wife wigs wild wile will wilt wily wimp wind
wine wing wink wins wipe wire wiry wise wish wisp wist with wits wive woes woke woks
wolf womb wont wood woof wool woos word wore work worm worn wort wove wows wrap wren
writ yack yams yang yank yard yarn yawl yawn yaws yeah year yeas yell yelp yens yeti
yews yoga yoke yolk yore your yowl yuck yule zags zany zaps zeal zero zest zinc zing
zips zits zone zoom zoos
about above abuse actor acute admit adopt adult after again agent agree ahead alarm
album alert alike alive allow alone along aloud alpha altar alter amber amend among
angel anger angle angry ankle apart apple apply arena argue arise armor array arrow
aside asset audio audit avoid awake award aware awful bacon badge baker basic basin
batch beach beard beast began begin being below bench berry bible bingo birth black
blade blame bland blank blast blaze bleak blend blind bliss block blood bloom blown
blues blunt board boast bonus boost booth borne bound brain brake brand brass brave
bread break breed brick bride brief bring brink broad broke brook broom brown brush
brute build built bunch burst cabin cable cache camel candy canon cargo carol carry
carve catch cause cease cedar chain chair chalk champ chant chaos charm chart chase
cheap cheat check cheek cheer chess chest chief child chili chill china chirp choir
chose chuck chunk churn cider cigar civic civil claim clamp clash clasp class clean
clear clerk click cliff climb cling cloak clock clone close cloth cloud clout clown
coach coast cobra cocoa colon color comet comic coral couch cough could count court
cover covet crack craft cramp crane crank crash crate crave crawl craze crazy cream
creek creep crepe crept crest crime crisp croak crook cross crowd crown crude cruel
crumb crush crust crypt curio curly curry curse curve cycle daily dairy daisy dance
dandy dared dates datum dealt death debit debut decay decor delay delta dense depth
derby deter devil diary digit dimly dined diner dingo dingy dirty disco ditch ditto
diver dizzy dodge doing donor doubt dough dowel downy dozen draft drain drake drama
drank drape drawn dread dream dress dried drift drill drink drive droll drone droop
drove drown drums drunk dryer dummy dusky dusty dwarf dwell dying eager eagle early
earth easel eaten ebony edged eerie eight elbow elder elect elite empty enact ended
enemy enjoy enter entry equal equip erase error essay ether evade event every evict
evoke exact exalt excel exert exile exist extra fable faced facet fairy faith false
fancy fatal fault favor feast fence ferry fetch fever fewer fiber field fiend fiery
fifth fifty fight filer filet filly final finch fined finer first fishy fixed fizzy
flair flake flame flank flare flash flask fleck flesh flick fling flint flirt float
flock flood floor flora floss flour flout flown fluid fluke flung flush flute flyer
foamy focal focus foggy folly foray force forge forgo forte forth forty forum found
frame frank fraud freak fresh fried frill frisk frock frond front frost froth frown
froze fruit fudge fully fumes funky funny furry fussy fuzzy gable gaily gamer gamma
gauge gaunt gauze gavel gawky gazer gecko geese genie genre ghost giant giddy gipsy
given giver glade gland glare glass glaze gleam glean glide glint gloat globe gloom
glory gloss glove gnome going golem golly goner goody goofy goose gorge gouge gourd
grace grade graft grain grand grant grape graph grasp grass grate grave gravy graze
great greed green greet grief grill grime grimy grind gripe groan groin groom grope
gross group grout grove growl grown gruel gruff grunt guard guess guest guide guild
guile guilt guise gulch gully gumbo gummy gusto gusty gypsy habit hairy halve handy
happy hardy harem harsh haste hasty hatch haunt haven havoc hazel heady heart heath
heave heavy hedge hefty hello hence heron hilly hinge hippo hippy hitch hoard hobby
hoist holly homer honey honor horde horse hotel hound house hovel hover howdy human
humid humor hunch hurry husky hydro hyena ideal idiom idiot idler igloo image imbue
impel imply inane inbox incur index inept inert infer ingot inlet inner input inter
intro ionic irate irony issue ivory jaded jazzy jeans jelly jenny jerky jetty jewel
joint joist joker jolly joust judge juice juicy jumbo jumpy junky juror kayak kebab
kempt ketch khaki kinky kiosk kitty knack knave knead kneel knelt knife knock knoll
known koala label labor laden lager lance lanky lapel lapse large larva laser later
latex lathe latte laugh layer leach leafy leaky leant leapt learn lease leash least
leave ledge leech leery legal lemon lemur level lever libel light liken lilac limbo
limit lined linen liner lingo lipid liver livid llama loath lobby local locus lodge
lofty logic loner loony loose lorry loser lotus louse lousy lover lower loyal lucid
lucky lumen lumpy lunar lunch lunge lurch lurid lusty lying lymph lyric macaw macho
macro madam madly magic magma maize major maker mango mania manor maple march marry
marsh mason match mauve maxim maybe mayor mealy meant meaty medal media melee melon
mercy merge merit merry messy metal meter metro micro midst might mimic mince miner
minor minus mirth miser mocha modal model modem moist molar moldy money month moody
moose moral moron morph mossy motel motor motto mound mount mourn mouse mousy mouth
mover movie mower mucky muddy mulch mummy munch mural murky mushy music musty muted
nadir naive naked nanny nasal nasty naval navel needy nerdy nerve never newer newly
nicer niche niece night ninja ninny ninth noble nobly noise noisy nomad noose north
nosey notch noted novel nudge nurse nutty nylon nymph oasis occur ocean octal octet
odder odors offer often olden older olive omega onion onset opera opine optic orbit
order organ ought ounce outdo outer ovary overt owing owner oxide ozone paced paddy
pagan paint paler palsy panda panel panic pansy papal paper parka parry parse party
pasta paste pasty patch patio pause peace peach pearl pecan pedal penal pence penny
peony perch peril perky pesky petal petty phase phone photo piano picky piece piety
piggy pilot pinch piney pinky pious piper pique pitch pivot pixel pizza place plaid
plain plait plane plank plant plate plaza plead pleat plied plonk pluck plumb plume
plump plunk plush poach point poise poker polar polka pooch poppy porch posed poser
posse pouch pound power prank prawn preen press price prick pride pried prime primp
print prior prism privy prize probe prone prong proof prose proud prove prowl proxy
prune pubic pudgy puffy pulpy pulse punch pupil puppy puree purer purge purse pushy
putty pygmy quack quail quake qualm quart quash quasi queen queer quell query quest
queue quick quiet quill quilt quirk quite quota quote rabbi rabid racer radar radio
rainy raise rajah rally ramen ranch randy range rapid raspy ratio raven rayon razor
reach react ready realm rearm rebel rebut recap recur reedy refer regal rehab reign
relax relay relic remit renal renew repay repel reply rerun reset resin retch retro
retry reuse revel rhino rhyme rider ridge rifle right rigid rigor rinse ripen riser
risky rival river rivet roach roast robin robot rocky rodeo rogue roman roomy roost
ropey rotor rouge rough round rouse route rover rowdy royal ruddy ruder rugby ruler
rumba rumor rural rusty saber sadly safer saint salad sally salon salsa salty salve
salvo sandy saner sappy sassy satin satyr sauce saucy sauna saute saved saver savor
savvy scald scale scalp scaly scamp scant scare scarf scary scene scent scoff scold
scone scoop scope score scorn scour scout scowl scrap scrub scrum seedy sepia serif
serum serve seven sever sewer shack shade shady shaft shake shaky shale shall shame
shank shape shard share shark sharp shave shawl sheaf shear sheen sheep sheer sheet
shelf shell shied shift shine shiny shire shirk shirt shoal shock shone shook shoot
shore shorn short shout shove shown showy shred shrew shrub shrug shuck shunt shush
shyly sided siege sieve sight sigma silky silly since sinew singe siren sissy sixth
sixty sized skate skein skier skiff skill skimp skirt skulk skull skunk slack slain
slang slant slash slate slave sleek sleep sleet slept slice slick slide slime slimy
sling slink slope slosh sloth slump slung slunk slurp slush small smart smash smear
smell smelt smile smirk smite smith smock smoke smoky snack snail snake snaky snare
snarl sneak sneer snide sniff snipe snoop snore snort snout snowy snuff soapy sober
soggy solar solid solve sonar sonic sooth sooty sorry sound south space spade spank
spare spark spasm spawn speak spear speck speed spell spend spent sperm spice spicy
spied spiel spike spiky spill spilt spine spiny spire spite splat split spoil spoke
spoof spook spool spoon spore sport spout spray spree sprig spunk spurn spurt squad
squat squib stack staff stage staid stain stair stake stale stalk stall stamp stand
stank stare stark start stash state stave steak steal steam steed steel steep steer
stein stern stick stiff still stilt sting stink stint stock stoic stoke stole stomp
stone stony stood stool stoop store stork storm story stout stove strap straw stray
strip strut stuck study stuff stump stung stunk stunt style suave sugar suing suite
sulky sully sunny super surer surge surly sushi swamp swarm swath sweat sweep sweet
swell swept swift swill swine swing swirl swish swoop sword swore sworn swung syrup
table taboo tacit tacky taffy taken taker tally talon tamer tango tangy taper tapir
tardy tarot taste tasty taunt tawny teach tease teddy teeth tempo tempt tenor tense
tenth tepee tepid terse testy thank theft their theme there these thick thief thigh
thing think third thong thorn those three threw throb throw thrum thumb thump thyme
tiara tibia tidal tiger tight tilde timer timid tipsy titan title toast today toddy
token tonal tonic tooth topaz topic torch torso total totem touch tough towel tower
toxic toxin trace track tract trade trail train trait tramp trash trawl tread treat
trend tress triad trial tribe trick tried tries tripe trite troll troop trope trout
trove truce truck truly trump trunk trust truth tryst tuber tulip tummy tumor tunic
turbo tutor twang tweak tweed tweet twice twine twirl twist tying udder ulcer ultra
umbra uncle uncut under undid undue unfit unify union unite unity unlit unmet untie
until unwed unzip upend upper upset urban urine usage usher using usual usurp utter
vague valet valid valor value valve vapor vault vegan venom venue verge verse vicar
video vigil vigor villa vinyl viola viper viral virus visit visor vista vital vivid
vixen vocal vodka vogue voice voila voted voter vouch vowel wacky wafer wager wagon
waist waltz waning warty waste watch water waver waxen weary weave wedge weedy weigh
weird welch welsh whack whale wharf wheat wheel whelp where which whiff while whine
whiny whirl whisk white whole whoop whose widen wider widow width wield wimpy wince
winch windy wiser wispy witch witty wives woken woman women woody wooer woozy wordy
world worry worse worst worth would wound woven wrack wrath wreak wreck wrest wring
wrist write wrong wrote wrung wryly xenon yacht yearn yeast yield yodel yokel young
youth yummy zebra zesty zonal
around before better change family friend ground little mother number people please
public really school should system things though within without wonder animal basket
bottle bridge button camera candle carpet castle circle closet coffee corner cotton
danger doctor dragon energy engine eraser expert famous finger flower forest garden
golden guitar hammer hidden honest hunter island jacket jungle ladder letter market
master melody memory mirror monkey moment motion museum native nation nature object
office orange output packet palace parent person planet player pocket poison police
potato prince prison puzzle rabbit random reason record region remote report return
ribbon rocket sailor salmon season secret shadow signal silver simple singer sister
soccer spider spirit spring square stream street string studio summer sunset switch
symbol talent target temple tennis theory ticket tissue toward travel tunnel turkey
twelve twenty valley velvet vision voyage wallet wander weapon weasel window winter
wisdom wizard wooden worker writer yellow zigzag zombie
`;

const WORDS = new Set(
  WORD_SOURCE.toLowerCase()
    .split(/\s+/)
    .filter((w) => /^[a-z]{3,}$/.test(w))
);

// -------------------------------------------------------------------
//  LETTER GENERATION (weighted toward common English letters)
// -------------------------------------------------------------------
const LETTER_WEIGHTS = {
  E: 127, T: 91, A: 82, O: 75, I: 70, N: 67, S: 63, H: 61, R: 60, D: 43,
  L: 40, U: 28, C: 28, M: 24, W: 24, F: 22, G: 20, Y: 20, P: 19, B: 15,
  V: 10, K: 8, J: 2, X: 2, Q: 1, Z: 1,
};

const LETTER_POOL = [];
for (const [letter, weight] of Object.entries(LETTER_WEIGHTS)) {
  const n = Math.max(1, Math.round(weight / 3));
  for (let i = 0; i < n; i++) LETTER_POOL.push(letter);
}
function randomLetter() {
  return LETTER_POOL[(Math.random() * LETTER_POOL.length) | 0];
}

// -------------------------------------------------------------------
//  CONSTANTS
// -------------------------------------------------------------------
const SIZE = 4;
const SPACING = 2.2;
const OFFSET = ((SIZE - 1) * SPACING) / 2; // 3.3 -> centers grid on origin
const CUBE_SIZE = 1.5;

const COL_EDGE = 0x00aaff;
const COL_SELECT = 0x00ffff;
const COL_VALID = 0x00ff88;
const COL_INVALID = 0xff3333;
const COL_WHITE = 0xffffff;
const EDGE_OPACITY = 0.4;

const ASSEMBLE_DURATION = 0.7;
const ASSEMBLE_TOTAL = 1.5;

const gridToWorld = (g) => g * SPACING - OFFSET;

// -------------------------------------------------------------------
//  EASING
// -------------------------------------------------------------------
const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);
const easeInCubic = (p) => p * p * p;
const easeInOutQuad = (p) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const easeOutBack = (p) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

// -------------------------------------------------------------------
//  DOM REFERENCES
// -------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const elWord = $('current-word');
const elHint = $('hint');
const elScore = $('score');
const elWordsFound = $('words-found');
const elAxis = $('axis-indicator');
const elSubmit = $('submit-btn');
const elNewGame = $('new-game-btn');
const elOverlay = $('message-overlay');
const elMsgTitle = $('message-title');
const elMsgSub = $('message-sub');
const elMsgBtn = $('message-btn');
const elLoading = $('loading');

// -------------------------------------------------------------------
//  SCENE / CAMERA / RENDERER
// -------------------------------------------------------------------
const canvas = $('scene');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(8, 6, 14);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 8;
controls.maxDistance = 35;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.4;
controls.enablePan = false;

// A touch of ambient light (mostly for any standard-material extras /
// the selection point lights to have something to bite into).
scene.add(new THREE.AmbientLight(0x223344, 0.6));

// -------------------------------------------------------------------
//  STARFIELD  (two sizes for a little variation; static)
// -------------------------------------------------------------------
const starGroup = new THREE.Group();
scene.add(starGroup);

function makeStars(count, size, opacity) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // random point in a thick spherical shell around the grid
    const r = 90 + Math.random() * 320;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size,
    sizeAttenuation: false,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}
starGroup.add(makeStars(620, 1.4, 0.85)); // tiny
starGroup.add(makeStars(320, 2.6, 0.95)); // slightly less tiny

// -------------------------------------------------------------------
//  NEBULA  (a few large, faint, additive sprites — atmosphere only)
// -------------------------------------------------------------------
function radialTexture(hex) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const col = new THREE.Color(hex);
  const r = Math.round(col.r * 255);
  const g = Math.round(col.g * 255);
  const b = Math.round(col.b * 255);
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0.0, `rgba(${r},${g},${b},0.9)`);
  grad.addColorStop(0.4, `rgba(${r},${g},${b},0.35)`);
  grad.addColorStop(1.0, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const NEBULAE = [
  { color: 0x1a0033, scale: 60, pos: [-14, -10, -55], opacity: 0.5 },
  { color: 0x000833, scale: 80, pos: [22, 8, -70], opacity: 0.55 },
  { color: 0x1a0033, scale: 48, pos: [6, 18, -45], opacity: 0.4 },
];
for (const n of NEBULAE) {
  const mat = new THREE.SpriteMaterial({
    map: radialTexture(n.color),
    transparent: true,
    opacity: n.opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(n.scale, n.scale, 1);
  sprite.position.set(...n.pos);
  scene.add(sprite);
}

// -------------------------------------------------------------------
//  GRID CONNECTION LINES  (faint static lattice cage)
// -------------------------------------------------------------------
{
  const pts = [];
  for (let x = 0; x < SIZE; x++)
    for (let y = 0; y < SIZE; y++)
      for (let z = 0; z < SIZE; z++) {
        const px = gridToWorld(x);
        const py = gridToWorld(y);
        const pz = gridToWorld(z);
        if (x < SIZE - 1) pts.push(px, py, pz, gridToWorld(x + 1), py, pz);
        if (y < SIZE - 1) pts.push(px, py, pz, px, gridToWorld(y + 1), pz);
        if (z < SIZE - 1) pts.push(px, py, pz, px, py, gridToWorld(z + 1));
      }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const mat = new THREE.LineBasicMaterial({
    color: 0x334455,
    transparent: true,
    opacity: 0.08,
  });
  scene.add(new THREE.LineSegments(geo, mat));
}

// -------------------------------------------------------------------
//  LETTER TEXTURES  (cached per letter — dark glowing face)
// -------------------------------------------------------------------
const textureCache = new Map();
function getLetterTexture(letter) {
  if (textureCache.has(letter)) return textureCache.get(letter);
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');

  // semi-transparent dark face
  ctx.fillStyle = 'rgba(10, 10, 26, 0.85)';
  ctx.fillRect(0, 0, 256, 256);

  // faint inner border for a little depth
  ctx.strokeStyle = 'rgba(0, 170, 255, 0.10)';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 236, 236);

  // glowing white letter (drawn twice for a stronger bloom)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 150px "Space Mono", "Courier New", monospace';
  ctx.shadowColor = 'rgba(160, 220, 255, 0.95)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(letter, 128, 140);
  ctx.shadowBlur = 14;
  ctx.fillText(letter, 128, 140);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(letter, tex);
  return tex;
}

// shared geometries (one box / one edge set reused by every cube)
const boxGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
const edgeGeo = new THREE.EdgesGeometry(boxGeo);

// -------------------------------------------------------------------
//  GAME STATE
// -------------------------------------------------------------------
let grid = []; // grid[x][y][z] -> cube | null
let cubes = []; // flat list of live cubes
let selection = []; // ordered list of selected cubes
let selectionLights = [];
let anchor = null; // first selected cube
let lockedAxis = null; // 'x' | 'y' | 'z' | null

let tweens = [];
let interactionLocked = true; // unlocked once the grid finishes assembling
let gameState = 'loading'; // 'loading' | 'playing' | 'won' | 'dead'

let targetScore = 0;
let displayedScore = 0;
let foundCount = 0;

let now = performance.now() / 1000; // must be real time before any tween is made
let prevT = now;
let lastInteract = now;

// -------------------------------------------------------------------
//  TWEEN SYSTEM
// -------------------------------------------------------------------
function tween({ duration, onUpdate, onComplete, delay = 0 }) {
  tweens.push({
    start: now + delay,
    duration: Math.max(0.0001, duration),
    onUpdate,
    onComplete,
  });
}
function scheduleAfter(delay, fn) {
  tween({ duration: 0.0001, delay, onUpdate: null, onComplete: fn });
}
function updateTweens() {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const t = tweens[i];
    if (now < t.start) continue;
    const p = Math.min(1, (now - t.start) / t.duration);
    if (t.onUpdate) t.onUpdate(p);
    if (p >= 1) {
      tweens.splice(i, 1);
      if (t.onComplete) t.onComplete();
    }
  }
}

// -------------------------------------------------------------------
//  CUBE CREATION
// -------------------------------------------------------------------
function makeCube(letter, gx, gy, gz) {
  const group = new THREE.Group();

  const mat = new THREE.MeshBasicMaterial({
    map: getLetterTexture(letter),
    transparent: true,
    opacity: 1,
    depthWrite: true,
  });
  const mesh = new THREE.Mesh(boxGeo, mat);

  const edgeMat = new THREE.LineBasicMaterial({
    color: COL_EDGE,
    transparent: true,
    opacity: EDGE_OPACITY,
  });
  const edges = new THREE.LineSegments(edgeGeo, edgeMat);

  // fake bloom: a slightly larger additive shell behind the cube
  const bloomMat = new THREE.MeshBasicMaterial({
    color: COL_SELECT,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const bloom = new THREE.Mesh(boxGeo, bloomMat);
  bloom.scale.setScalar(1.18);
  bloom.visible = false;

  group.add(mesh, edges, bloom);
  group.position.set(gridToWorld(gx), gridToWorld(gy), gridToWorld(gz));

  const cube = {
    group, mesh, edges, bloom, mat, edgeMat, bloomMat,
    letter, gx, gy, gz,
    selected: false,
    busy: false,
  };
  mesh.userData.cube = cube;
  return cube;
}

// -------------------------------------------------------------------
//  GRID SCAN  (used both for seeding and for "no moves" detection)
//  getCell(x, y, z) -> { letter } | null
//  Returns a list of { word, cells } for every valid 3-4 letter word
//  found in a contiguous run of cells along any axis (fwd or reversed).
// -------------------------------------------------------------------
function scanGrid(getCell) {
  const found = [];

  const checkRun = (run) => {
    const letters = run.map((c) => (c.letter || '').toLowerCase());
    const n = letters.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 3; j <= n; j++) {
        const seg = letters.slice(i, j);
        const fwd = seg.join('');
        const bwd = seg.slice().reverse().join('');
        if (WORDS.has(fwd)) found.push({ word: fwd, cells: run.slice(i, j) });
        else if (WORDS.has(bwd))
          found.push({ word: bwd, cells: run.slice(i, j) });
      }
    }
  };

  const scanLine = (cells) => {
    let run = [];
    for (const c of cells) {
      if (c) run.push(c);
      else {
        if (run.length >= 3) checkRun(run);
        run = [];
      }
    }
    if (run.length >= 3) checkRun(run);
  };

  for (let a = 0; a < SIZE; a++) {
    for (let b = 0; b < SIZE; b++) {
      const lineX = [];
      const lineY = [];
      const lineZ = [];
      for (let v = 0; v < SIZE; v++) {
        lineX.push(getCell(v, a, b));
        lineY.push(getCell(a, v, b));
        lineZ.push(getCell(a, b, v));
      }
      scanLine(lineX);
      scanLine(lineY);
      scanLine(lineZ);
    }
  }
  return found;
}

// -------------------------------------------------------------------
//  SEEDING  (guarantee >= 12 words; up to 50 attempts)
// -------------------------------------------------------------------
function seedLetters() {
  let best = null;
  let bestCount = -1;
  for (let attempt = 0; attempt < 50; attempt++) {
    const L = [];
    for (let x = 0; x < SIZE; x++) {
      L[x] = [];
      for (let y = 0; y < SIZE; y++) {
        L[x][y] = [];
        for (let z = 0; z < SIZE; z++) L[x][y][z] = randomLetter();
      }
    }
    const count = scanGrid((x, y, z) => ({ letter: L[x][y][z] })).length;
    if (count >= 12) return L;
    if (count > bestCount) {
      bestCount = count;
      best = L;
    }
  }
  return best; // best effort if we somehow never reach 12
}

// -------------------------------------------------------------------
//  BUILD / TEARDOWN
// -------------------------------------------------------------------
function clearGridObjects() {
  for (const c of cubes) {
    scene.remove(c.group);
    c.mat.dispose();
    c.edgeMat.dispose();
    c.bloomMat.dispose();
  }
  cubes = [];
  for (const l of selectionLights) scene.remove(l);
  selectionLights = [];
}

function buildGrid() {
  const L = seedLetters();
  grid = [];
  cubes = [];
  for (let x = 0; x < SIZE; x++) {
    grid[x] = [];
    for (let y = 0; y < SIZE; y++) {
      grid[x][y] = [];
      for (let z = 0; z < SIZE; z++) {
        const cube = makeCube(L[x][y][z], x, y, z);
        grid[x][y][z] = cube;
        cubes.push(cube);
        scene.add(cube.group);
      }
    }
  }
  animateAssembly();
}

// staggered fly-in / fade-in assembly
function animateAssembly() {
  interactionLocked = true;
  const n = cubes.length;
  cubes.forEach((cube, i) => {
    const home = cube.group.position.clone();
    // start slightly outside the final position
    const dir = home.clone().normalize();
    const start = home
      .clone()
      .multiplyScalar(1.45)
      .add(dir.multiplyScalar(2 + Math.random() * 3));
    cube.busy = true;
    cube.group.position.copy(start);
    cube.group.scale.setScalar(0.05);
    cube.mat.opacity = 0;
    cube.edgeMat.opacity = 0;

    const delay = (i / n) * (ASSEMBLE_TOTAL - ASSEMBLE_DURATION);
    tween({
      duration: ASSEMBLE_DURATION,
      delay,
      onUpdate: (p) => {
        const e = easeOutCubic(p);
        cube.group.position.lerpVectors(start, home, e);
        cube.group.scale.setScalar(easeOutBack(p));
        cube.mat.opacity = e;
        cube.edgeMat.opacity = EDGE_OPACITY * e;
      },
      onComplete: () => {
        cube.group.position.copy(home);
        cube.group.scale.setScalar(1);
        cube.mat.opacity = 1;
        cube.edgeMat.opacity = EDGE_OPACITY;
        cube.busy = false;
      },
    });
  });
  scheduleAfter(ASSEMBLE_TOTAL + 0.1, () => {
    if (gameState === 'loading' || gameState === 'playing')
      interactionLocked = false;
  });
}

// -------------------------------------------------------------------
//  SELECTION
// -------------------------------------------------------------------
const coordOf = (c, axis) => (axis === 'x' ? c.gx : axis === 'y' ? c.gy : c.gz);

function sharedAxis(a, b) {
  if (a.gy === b.gy && a.gz === b.gz && a.gx !== b.gx) return 'x';
  if (a.gx === b.gx && a.gz === b.gz && a.gy !== b.gy) return 'y';
  if (a.gx === b.gx && a.gy === b.gy && a.gz !== b.gz) return 'z';
  return null;
}
function onSameLine(a, b, axis) {
  if (axis === 'x') return a.gy === b.gy && a.gz === b.gz;
  if (axis === 'y') return a.gx === b.gx && a.gz === b.gz;
  return a.gx === b.gx && a.gy === b.gy;
}

// all contiguous cubes from anchor toward end along axis (stops at a gap)
function buildLine(start, end, axis) {
  const res = [];
  const a0 = coordOf(start, axis);
  const a1 = coordOf(end, axis);
  const step = a1 >= a0 ? 1 : -1;
  for (let v = a0; ; v += step) {
    let x = start.gx, y = start.gy, z = start.gz;
    if (axis === 'x') x = v;
    else if (axis === 'y') y = v;
    else z = v;
    const cube = grid[x] && grid[x][y] ? grid[x][y][z] : null;
    if (!cube) break;
    res.push(cube);
    if (v === a1) break;
  }
  return res;
}

function setSelection(arr) {
  for (const c of selection) c.selected = false;
  selection = arr;
  for (const c of selection) c.selected = true;

  // selection point lights (cyan) — one per selected cube
  for (const l of selectionLights) scene.remove(l);
  selectionLights = [];
  for (const c of selection) {
    const light = new THREE.PointLight(COL_SELECT, 1.4, 6, 2);
    light.position.copy(c.group.position);
    scene.add(light);
    selectionLights.push(light);
  }
}

function clearSelection() {
  setSelection([]);
  anchor = null;
  lockedAxis = null;
  updateWordHUD();
  updateAxisHUD();
}

function onCubeClick(cube) {
  playClick();
  if (!anchor) {
    anchor = cube;
    lockedAxis = null;
    setSelection([cube]);
  } else if (!lockedAxis) {
    if (cube === anchor) {
      clearSelection();
      return;
    }
    const ax = sharedAxis(anchor, cube);
    if (ax) {
      lockedAxis = ax;
      setSelection(buildLine(anchor, cube, ax));
    } else {
      // not aligned — start fresh from the new cube
      anchor = cube;
      lockedAxis = null;
      setSelection([cube]);
    }
  } else {
    if (cube === anchor) {
      lockedAxis = null;
      setSelection([anchor]);
    } else if (onSameLine(anchor, cube, lockedAxis)) {
      setSelection(buildLine(anchor, cube, lockedAxis));
    } else {
      anchor = cube;
      lockedAxis = null;
      setSelection([cube]);
    }
  }
  updateWordHUD();
  updateAxisHUD();
}

// -------------------------------------------------------------------
//  SUBMIT / VALIDATE
// -------------------------------------------------------------------
function currentLetters() {
  return selection.map((c) => c.letter.toLowerCase());
}
function isValidSelection() {
  if (selection.length < 3) return false;
  const letters = currentLetters();
  const fwd = letters.join('');
  const bwd = letters.slice().reverse().join('');
  return WORDS.has(fwd) || WORDS.has(bwd);
}

function submit() {
  if (gameState !== 'playing' || interactionLocked) return;
  if (selection.length < 3) {
    shakeWord();
    playInvalid();
    return;
  }
  const letters = currentLetters();
  const fwd = letters.join('');
  const bwd = letters.slice().reverse().join('');
  const list = selection.slice();
  if (WORDS.has(fwd) || WORDS.has(bwd)) {
    onValid(WORDS.has(fwd) ? fwd : bwd, list);
  } else {
    onInvalid(list);
  }
}

function onValid(word, list) {
  interactionLocked = true;
  const pts = list.length * 10;
  targetScore += pts;
  addFoundWord(word, pts);

  setSelection([]);
  anchor = null;
  lockedAxis = null;
  updateWordHUD();
  updateAxisHUD();

  playValid(word.length);

  // 1) flash green, then 2) clear (white pop), then 3) gravity, then rescan
  flashCubes(list, COL_VALID, 0.3, () => {
    playClear();
    let remaining = list.length;
    for (const c of list) {
      clearCubeAnim(c, () => {
        removeCube(c);
        remaining -= 1;
        if (remaining === 0) {
          const moved = applyGravity();
          scheduleAfter((moved ? 0.5 : 0) + 0.6, afterResolve);
        }
      });
    }
  });
}

function onInvalid(list) {
  interactionLocked = true;
  playInvalid();
  setSelection([]);
  anchor = null;
  lockedAxis = null;
  updateWordHUD();
  updateAxisHUD();
  flashCubes(list, COL_INVALID, 0.3, () => {
    interactionLocked = false;
  });
}

function afterResolve() {
  clearSelection();
  if (cubes.length === 0) {
    winGame();
    return;
  }
  interactionLocked = false;
  const remaining = scanGrid((x, y, z) => grid[x][y][z]);
  if (remaining.length === 0) noMoreWords();
}

// -------------------------------------------------------------------
//  CUBE ANIMATIONS: flash / clear / fall
// -------------------------------------------------------------------
function flashCubes(list, colorHex, duration, done) {
  for (const c of list) c.busy = true;
  tween({
    duration,
    onUpdate: (p) => {
      const pulse = 0.5 + 0.5 * Math.sin(p * Math.PI * 3);
      for (const c of list) {
        c.edgeMat.color.setHex(colorHex);
        c.edgeMat.opacity = 0.6 + 0.4 * pulse;
        c.mat.color.setHex(colorHex);
        c.bloom.visible = true;
        c.bloomMat.color.setHex(colorHex);
        c.bloomMat.opacity = 0.18 + 0.14 * pulse;
      }
    },
    onComplete: () => {
      for (const c of list) {
        c.busy = false;
        c.mat.color.setHex(COL_WHITE);
        c.bloom.visible = false;
      }
      if (done) done();
    },
  });
}

function clearCubeAnim(c, done) {
  c.busy = true;
  c.selected = false;
  const baseScale = c.group.scale.x || 1;
  tween({
    duration: 0.4,
    onUpdate: (p) => {
      // bright white flash that peaks early, then scale down to nothing
      const flash = Math.sin(Math.min(1, p * 1.7) * Math.PI);
      c.bloom.visible = true;
      c.bloomMat.color.setHex(COL_WHITE);
      c.bloomMat.opacity = Math.max(0, flash) * 0.95;
      c.edgeMat.color.setHex(COL_WHITE);
      c.edgeMat.opacity = 1 - p;
      c.mat.color.setHex(COL_WHITE);
      c.mat.opacity = 1 - easeInCubic(p);
      c.group.scale.setScalar(Math.max(0.0001, baseScale * (1 - easeInCubic(p))));
    },
    onComplete: () => {
      if (done) done();
    },
  });
}

function fallTween(c, targetWorldY) {
  c.busy = true;
  const startY = c.group.position.y;
  tween({
    duration: 0.5,
    onUpdate: (p) => {
      const e = easeInOutQuad(p);
      c.group.position.y = startY + (targetWorldY - startY) * e;
      // fake motion-blur trail: a brief opacity dip mid-fall
      const dip = Math.sin(p * Math.PI);
      c.mat.opacity = 1 - 0.35 * dip;
    },
    onComplete: () => {
      c.group.position.y = targetWorldY;
      c.mat.opacity = 1;
      c.busy = false;
    },
  });
}

function removeCube(c) {
  scene.remove(c.group);
  c.mat.dispose();
  c.edgeMat.dispose();
  c.bloomMat.dispose();
  if (grid[c.gx] && grid[c.gx][c.gy]) grid[c.gx][c.gy][c.gz] = null;
  const idx = cubes.indexOf(c);
  if (idx >= 0) cubes.splice(idx, 1);
}

// gravity along -Y: each column (x,z) collapses toward y = 0
function applyGravity() {
  let moved = false;
  for (let x = 0; x < SIZE; x++) {
    for (let z = 0; z < SIZE; z++) {
      let writeY = 0;
      for (let y = 0; y < SIZE; y++) {
        const c = grid[x][y][z];
        if (!c) continue;
        if (y !== writeY) {
          grid[x][y][z] = null;
          grid[x][writeY][z] = c;
          c.gy = writeY;
          fallTween(c, gridToWorld(writeY));
          moved = true;
        }
        writeY += 1;
      }
    }
  }
  return moved;
}

// -------------------------------------------------------------------
//  WIN / DEAD STATES
// -------------------------------------------------------------------
function winGame() {
  gameState = 'won';
  interactionLocked = true;
  playWin();
  // remaining starfield accelerates outward
  const s0 = starGroup.scale.x;
  tween({
    duration: 4,
    onUpdate: (p) => {
      const e = easeOutCubic(p);
      starGroup.scale.setScalar(s0 + (5 - s0) * e);
    },
  });
  showMessage('LATTICE COMPLETE', `FINAL SCORE ${targetScore}`, 'New Game');
}

function noMoreWords() {
  gameState = 'dead';
  interactionLocked = true;
  showMessage(
    'NO MORE WORDS',
    `${cubes.length} CUBES REMAIN · SCORE ${targetScore}`,
    'New Game'
  );
}

// -------------------------------------------------------------------
//  NEW GAME
// -------------------------------------------------------------------
function newGame() {
  hideMessage();
  tweens = [];
  clearGridObjects();
  grid = [];
  selection = [];
  anchor = null;
  lockedAxis = null;

  starGroup.scale.setScalar(1);
  targetScore = 0;
  displayedScore = 0;
  foundCount = 0;
  renderFoundReset();

  gameState = 'playing';
  buildGrid();
  updateWordHUD();
  updateAxisHUD();
}

// -------------------------------------------------------------------
//  HUD
// -------------------------------------------------------------------
function updateWordHUD() {
  const letters = selection.map((c) => c.letter);
  elWord.textContent = letters.join(' ');
  elWord.classList.remove('shake');
  elWord.classList.toggle('valid', isValidSelection());
  // hint visible only when nothing is selected and we're playing
  const showHint = selection.length === 0 && gameState === 'playing';
  elHint.style.opacity = showHint ? '1' : '0';
}

function shakeWord() {
  elWord.classList.remove('shake');
  // force reflow so the animation can restart
  void elWord.offsetWidth;
  elWord.classList.add('shake');
}

function updateAxisHUD() {
  if (!lockedAxis || selection.length < 2) {
    elAxis.innerHTML = 'AXIS <b>—</b>';
    return;
  }
  const last = selection[selection.length - 1];
  const dir = coordOf(last, lockedAxis) - coordOf(anchor, lockedAxis);
  let arrow = '';
  if (lockedAxis === 'x') arrow = dir >= 0 ? '→' : '←';
  else if (lockedAxis === 'y') arrow = dir >= 0 ? '↑' : '↓';
  else arrow = dir >= 0 ? '⊙' : '⊗'; // z: toward / away
  elAxis.innerHTML = `AXIS <b>${lockedAxis.toUpperCase()} ${arrow}</b>`;
}

function addFoundWord(word, pts) {
  foundCount += 1;
  const div = document.createElement('div');
  div.className = 'found-item';
  div.innerHTML = `${word.toUpperCase()}<span class="pts">+${pts}</span>`;
  // newest on top, just under the label
  elWordsFound.insertBefore(div, elWordsFound.children[1] || null);
  // keep only the last 5 (plus the label at index 0)
  while (elWordsFound.children.length > 6)
    elWordsFound.removeChild(elWordsFound.lastChild);
}
function renderFoundReset() {
  while (elWordsFound.children.length > 1)
    elWordsFound.removeChild(elWordsFound.lastChild);
}

function showMessage(title, sub, btn) {
  elMsgTitle.textContent = title;
  elMsgSub.textContent = sub || '';
  elMsgBtn.textContent = btn || 'New Game';
  elOverlay.classList.add('show');
}
function hideMessage() {
  elOverlay.classList.remove('show');
}

// -------------------------------------------------------------------
//  SOUND  (Web Audio — generated tones, no files)
// -------------------------------------------------------------------
let audioCtx = null;
function ensureAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    audioCtx = null;
  }
}
function tone(freq, dur, type = 'sine', vol = 0.15, when = 0) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime + when;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}
function playClick() {
  ensureAudio();
  tone(440, 0.07, 'sine', 0.06);
}
function playValid(len) {
  ensureAudio();
  const base = 330;
  const steps = Math.min(len, 6);
  for (let i = 0; i < steps; i++)
    tone(base * Math.pow(2, (i * 2) / 12), 0.2, 'triangle', 0.11, i * 0.07);
}
function playInvalid() {
  ensureAudio();
  tone(150, 0.22, 'sawtooth', 0.07);
  tone(120, 0.22, 'sawtooth', 0.05, 0.02);
}
function playClear() {
  ensureAudio();
  tone(90, 0.6, 'sine', 0.18);
  tone(120, 0.5, 'sine', 0.1, 0.02);
}
function playWin() {
  ensureAudio();
  const notes = [330, 415, 494, 659, 784];
  notes.forEach((f, i) => tone(f, 0.5, 'triangle', 0.12, i * 0.12));
}

// -------------------------------------------------------------------
//  INTERACTION (raycasting + idle auto-rotate)
// -------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let pointerDown = null;

function resetIdle() {
  lastInteract = now;
  controls.autoRotate = false;
}

function raycastCube(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const meshes = cubes.map((c) => c.mesh);
  const hits = raycaster.intersectObjects(meshes, false);
  return hits.length ? hits[0].object.userData.cube : null;
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  ensureAudio();
  resetIdle();
  pointerDown = { x: e.clientX, y: e.clientY };
});
renderer.domElement.addEventListener('pointerup', (e) => {
  resetIdle();
  if (!pointerDown) return;
  const dx = e.clientX - pointerDown.x;
  const dy = e.clientY - pointerDown.y;
  pointerDown = null;
  if (Math.hypot(dx, dy) > 6) return; // it was a drag (orbit), not a click
  if (interactionLocked || gameState !== 'playing') return;
  const cube = raycastCube(e.clientX, e.clientY);
  if (cube) onCubeClick(cube);
  else clearSelection();
});
renderer.domElement.addEventListener('wheel', resetIdle, { passive: true });
controls.addEventListener('start', resetIdle);

window.addEventListener('keydown', (e) => {
  resetIdle();
  if (e.key === 'Enter') {
    e.preventDefault();
    submit();
  } else if (e.key === 'Escape') {
    if (gameState === 'playing') clearSelection();
  }
});

elSubmit.addEventListener('click', submit);
elNewGame.addEventListener('click', newGame);
elMsgBtn.addEventListener('click', newGame);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// -------------------------------------------------------------------
//  PER-FRAME CUBE STYLING (selection pulse + return to rest)
// -------------------------------------------------------------------
const restScale = new THREE.Vector3(1, 1, 1);
function styleCubes() {
  const k = Math.min(1, (now - prevFrameForStyle) * 12);
  for (const c of cubes) {
    if (c.busy) continue; // an animation owns this cube right now
    if (c.selected) {
      const pulse = 0.5 + 0.5 * Math.sin(now * 5);
      const s = 1.12 + 0.05 * Math.sin(now * 5);
      c.group.scale.setScalar(s);
      c.edgeMat.color.setHex(COL_SELECT);
      c.edgeMat.opacity = 0.7 + 0.3 * pulse;
      c.bloom.visible = true;
      c.bloomMat.color.setHex(COL_SELECT);
      c.bloomMat.opacity = 0.12 + 0.08 * pulse;
      c.mat.color.setHex(COL_WHITE);
      c.mat.opacity = 1;
    } else {
      const sc = c.group.scale;
      sc.x += (1 - sc.x) * k;
      sc.y += (1 - sc.y) * k;
      sc.z += (1 - sc.z) * k;
      c.edgeMat.color.setHex(COL_EDGE);
      c.edgeMat.opacity = EDGE_OPACITY;
      c.bloom.visible = false;
      c.mat.color.setHex(COL_WHITE);
      c.mat.opacity = 1;
    }
  }
}
let prevFrameForStyle = prevT;

// -------------------------------------------------------------------
//  MAIN LOOP
// -------------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() / 1000;
  now = t;

  updateTweens();

  if (now - lastInteract > 5 && gameState === 'playing')
    controls.autoRotate = true;
  controls.update();

  styleCubes();
  prevFrameForStyle = now;

  // animated score tick-up
  displayedScore += (targetScore - displayedScore) * Math.min(1, (now - prevT) * 8);
  if (Math.abs(targetScore - displayedScore) < 0.5) displayedScore = targetScore;
  elScore.textContent = Math.round(displayedScore);

  // keep selection lights glued to their cubes
  for (let i = 0; i < selection.length; i++) {
    if (selectionLights[i]) selectionLights[i].position.copy(selection[i].group.position);
  }

  prevT = now;
  renderer.render(scene, camera);
}

// -------------------------------------------------------------------
//  BOOT
// -------------------------------------------------------------------
function init() {
  now = performance.now() / 1000; // align tween clock with the render loop
  prevT = now;
  prevFrameForStyle = now;
  lastInteract = now;
  gameState = 'playing';
  buildGrid();
  updateWordHUD();
  updateAxisHUD();
  animate();
  // fade out the loading splash
  setTimeout(() => elLoading.classList.add('hidden'), 300);
  setTimeout(() => {
    if (elLoading.parentNode) elLoading.parentNode.removeChild(elLoading);
  }, 1000);
}

init();
