import {} from './name.data'

function getAllName() {
  return {error: 0, status: 200, data: name}
}

export default {
  getAllName,
}