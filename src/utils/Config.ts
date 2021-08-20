interface ISitePosts {
	perPage: number
}

interface IConfig {
	sitePosts: ISitePosts
}

const Config: IConfig = {
	sitePosts: {
		perPage: 5,
	},
}

export default Config
