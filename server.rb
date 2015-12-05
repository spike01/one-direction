require "sinatra"
require "json"
require "securerandom"
require "pstore"

store = PStore.new("data.pstore")

get "/" do
  erb :index
end

post "/save" do
  key = SecureRandom.hex.slice(0, 6)
  value = JSON.parse(request.body.read)
  store.transaction { store[key.to_sym] = value }
  {key: key}.to_json
end

get "/:key" do
  @geometry = store.transaction { store[params[:key].to_sym] }.to_json
  erb :index
end
