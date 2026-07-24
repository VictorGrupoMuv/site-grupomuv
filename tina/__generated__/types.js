export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const ServicesPartsFragmentDoc = gql`
    fragment ServicesParts on Services {
  __typename
  items {
    __typename
    num
    tag
    title
    desc
    items
  }
}
    `;
export const ProcessPartsFragmentDoc = gql`
    fragment ProcessParts on Process {
  __typename
  items {
    __typename
    num
    title
    desc
    deliverables
  }
}
    `;
export const WorksPartsFragmentDoc = gql`
    fragment WorksParts on Works {
  __typename
  items {
    __typename
    slug
    title
    client
    tag
    year
    category
    format
    team
    gear
    summary
    body {
      __typename
      h
      p
    }
  }
}
    `;
export const TeamPartsFragmentDoc = gql`
    fragment TeamParts on Team {
  __typename
  items {
    __typename
    name
    role
    short
  }
}
    `;
export const PostsPartsFragmentDoc = gql`
    fragment PostsParts on Posts {
  __typename
  items {
    __typename
    slug
    date
    title
    excerpt
    read
    category
    body {
      __typename
      h
      p
    }
  }
}
    `;
export const FaqPartsFragmentDoc = gql`
    fragment FaqParts on Faq {
  __typename
  items {
    __typename
    cat
    q
    a
  }
}
    `;
export const BrandsPartsFragmentDoc = gql`
    fragment BrandsParts on Brands {
  __typename
  items
}
    `;
export const MarqueePartsFragmentDoc = gql`
    fragment MarqueeParts on Marquee {
  __typename
  items
}
    `;
export const ServicesDocument = gql`
    query services($relativePath: String!) {
  services(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ServicesParts
  }
}
    ${ServicesPartsFragmentDoc}`;
export const ServicesConnectionDocument = gql`
    query servicesConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ServicesFilter) {
  servicesConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ServicesParts
      }
    }
  }
}
    ${ServicesPartsFragmentDoc}`;
export const ProcessDocument = gql`
    query process($relativePath: String!) {
  process(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ProcessParts
  }
}
    ${ProcessPartsFragmentDoc}`;
export const ProcessConnectionDocument = gql`
    query processConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ProcessFilter) {
  processConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ProcessParts
      }
    }
  }
}
    ${ProcessPartsFragmentDoc}`;
export const WorksDocument = gql`
    query works($relativePath: String!) {
  works(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...WorksParts
  }
}
    ${WorksPartsFragmentDoc}`;
export const WorksConnectionDocument = gql`
    query worksConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: WorksFilter) {
  worksConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...WorksParts
      }
    }
  }
}
    ${WorksPartsFragmentDoc}`;
export const TeamDocument = gql`
    query team($relativePath: String!) {
  team(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...TeamParts
  }
}
    ${TeamPartsFragmentDoc}`;
export const TeamConnectionDocument = gql`
    query teamConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: TeamFilter) {
  teamConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...TeamParts
      }
    }
  }
}
    ${TeamPartsFragmentDoc}`;
export const PostsDocument = gql`
    query posts($relativePath: String!) {
  posts(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PostsParts
  }
}
    ${PostsPartsFragmentDoc}`;
export const PostsConnectionDocument = gql`
    query postsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PostsFilter) {
  postsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PostsParts
      }
    }
  }
}
    ${PostsPartsFragmentDoc}`;
export const FaqDocument = gql`
    query faq($relativePath: String!) {
  faq(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...FaqParts
  }
}
    ${FaqPartsFragmentDoc}`;
export const FaqConnectionDocument = gql`
    query faqConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: FaqFilter) {
  faqConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...FaqParts
      }
    }
  }
}
    ${FaqPartsFragmentDoc}`;
export const BrandsDocument = gql`
    query brands($relativePath: String!) {
  brands(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...BrandsParts
  }
}
    ${BrandsPartsFragmentDoc}`;
export const BrandsConnectionDocument = gql`
    query brandsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: BrandsFilter) {
  brandsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...BrandsParts
      }
    }
  }
}
    ${BrandsPartsFragmentDoc}`;
export const MarqueeDocument = gql`
    query marquee($relativePath: String!) {
  marquee(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...MarqueeParts
  }
}
    ${MarqueePartsFragmentDoc}`;
export const MarqueeConnectionDocument = gql`
    query marqueeConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: MarqueeFilter) {
  marqueeConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...MarqueeParts
      }
    }
  }
}
    ${MarqueePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    services(variables, options) {
      return requester(ServicesDocument, variables, options);
    },
    servicesConnection(variables, options) {
      return requester(ServicesConnectionDocument, variables, options);
    },
    process(variables, options) {
      return requester(ProcessDocument, variables, options);
    },
    processConnection(variables, options) {
      return requester(ProcessConnectionDocument, variables, options);
    },
    works(variables, options) {
      return requester(WorksDocument, variables, options);
    },
    worksConnection(variables, options) {
      return requester(WorksConnectionDocument, variables, options);
    },
    team(variables, options) {
      return requester(TeamDocument, variables, options);
    },
    teamConnection(variables, options) {
      return requester(TeamConnectionDocument, variables, options);
    },
    posts(variables, options) {
      return requester(PostsDocument, variables, options);
    },
    postsConnection(variables, options) {
      return requester(PostsConnectionDocument, variables, options);
    },
    faq(variables, options) {
      return requester(FaqDocument, variables, options);
    },
    faqConnection(variables, options) {
      return requester(FaqConnectionDocument, variables, options);
    },
    brands(variables, options) {
      return requester(BrandsDocument, variables, options);
    },
    brandsConnection(variables, options) {
      return requester(BrandsConnectionDocument, variables, options);
    },
    marquee(variables, options) {
      return requester(MarqueeDocument, variables, options);
    },
    marqueeConnection(variables, options) {
      return requester(MarqueeConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
