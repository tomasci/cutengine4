
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 2.28.0
 * Query Engine version: 89facabd0366f63911d089156a7a70125bfbcd27
 */
Prisma.prismaVersion = {
  client: "2.28.0",
  engine: "89facabd0366f63911d089156a7a70125bfbcd27"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */

Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.Mc_addonsScalarFieldEnum = makeEnum({
  id: 'id',
  filepath: 'filepath',
  folderpath: 'folderpath',
  uuid: 'uuid',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.Mc_dependenciesScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  uuid: 'uuid'
});

exports.Prisma.Mca_animation_controllersScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_animationsScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_attachablesScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_entitiesScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_entities_rpScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_fogsScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_itemsScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_loot_tablesScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_modelsScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_otherScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_particlesScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_recipesScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_render_controllersScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_scriptsScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_soundsScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_spawn_rulesScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_textsScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_texturesScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_tradingScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.Mca_uiScalarFieldEnum = makeEnum({
  id: 'id',
  mca_id: 'mca_id',
  filename: 'filename',
  filepath: 'filepath'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});


exports.Prisma.ModelName = makeEnum({
  mc_addons: 'mc_addons',
  mc_dependencies: 'mc_dependencies',
  mca_animation_controllers: 'mca_animation_controllers',
  mca_animations: 'mca_animations',
  mca_attachables: 'mca_attachables',
  mca_entities: 'mca_entities',
  mca_entities_rp: 'mca_entities_rp',
  mca_fogs: 'mca_fogs',
  mca_items: 'mca_items',
  mca_loot_tables: 'mca_loot_tables',
  mca_models: 'mca_models',
  mca_other: 'mca_other',
  mca_particles: 'mca_particles',
  mca_recipes: 'mca_recipes',
  mca_render_controllers: 'mca_render_controllers',
  mca_scripts: 'mca_scripts',
  mca_sounds: 'mca_sounds',
  mca_spawn_rules: 'mca_spawn_rules',
  mca_texts: 'mca_texts',
  mca_textures: 'mca_textures',
  mca_trading: 'mca_trading',
  mca_ui: 'mca_ui'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
