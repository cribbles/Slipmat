module Api
  class CommentsController < ApplicationController
    before_action :ensure_signed_in, only: :create

    def create
      @comment = Comment.new(comment_params)

      if @comment.save
        render :show
      else
        render json: @comment.errors.full_messages, status: 422
      end
    end

    private

    def comment_params
      params
        .require(:comment)
        .permit(:author_id, :body, :commentable_id, :commentable_type)
    end
  end
end
