interface ISitePosts {
	perPage: number
}

interface IConfig {
	sitePosts: ISitePosts
}

const Config: IConfig = {
	sitePosts: {
		perPage: 2,
	},
}

export default Config
