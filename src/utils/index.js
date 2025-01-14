const mapDBToModel = ({ created_at, update_at, ...args }) => ({
    ...args,
    createdAt: created_at,
    updatedAt: update_at,
});

module.exports = mapDBToModel;